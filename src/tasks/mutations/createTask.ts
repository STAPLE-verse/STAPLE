import { resolver } from "@blitzjs/rpc"
import db, { CompletedAs } from "db"
import { CreateTaskSchema } from "../schemas"
import sendNotification from "src/notifications/mutations/sendNotification"

export default resolver.pipe(
  resolver.zod(CreateTaskSchema),
  resolver.authorize(),
  async (
    {
      projectId,
      containerId,
      name,
      description,
      elementId,
      deadline,
      createdById,
      projectMembersId,
      formVersionId,
      rolesId,
    },
    ctx
  ) => {
    // Get number of tasks for the column inside the project
    const containerTaskOrder = await db.task.count({
      where: {
        projectId: projectId, // Filter tasks by projectId
        containerId: containerId, // Filter tasks by containerId
      },
    })

    // create the Task to have the taskId
    const task = await db.task.create({
      data: {
        name,
        description,
        containerTaskOrder,
        deadline,
        project: {
          connect: { id: projectId },
        },
        container: {
          connect: { id: containerId },
        },
        createdBy: {
          connect: { id: createdById },
        },
        formVersion: formVersionId
          ? {
              connect: { id: formVersionId },
            }
          : undefined,
        element: elementId
          ? {
              connect: { id: elementId },
            }
          : undefined,
      },
      include: {
        createdBy: {
          include: {
            users: true,
          },
        },
      },
    })

    // connect to selected roles
    let task1 = await db.task.update({
      where: { id: task.id },
      data: {
        roles: {
          connect: rolesId?.map((c) => ({ id: c })) || [],
        },
      },
    })

    // create initial statusLogs
    if (projectMembersId != null && projectMembersId.length != 0) {
      projectMembersId.forEach(async (projectMemberId) => {
        // figure out if team or individual based on number of userIds
        const projectMember = await db.projectMember.findUnique({
          where: { id: projectMemberId },
          select: { users: true },
        })

        // Count the number of user IDs in the 'users' array
        const userCount = projectMember?.users.length || 0

        // Determine if it's a team or individual based on the user count
        const completedAsData = userCount > 1 ? "TEAM" : "INDIVIDUAL"

        // Create the taskLog
        const taskLog = await db.taskLog.create({
          data: {
            task: { connect: { id: task.id } },
            assignedTo: { connect: { id: projectMemberId } },
            completedAs: completedAsData,
          },
        })
      })

      // create announcement
      // Fetch User IDs corresponding to the ProjectMember IDs
      const users = await db.projectMember.findMany({
        where: {
          id: { in: projectMembersId },
        },
        select: {
          users: true, // Only select the userId field
        },
      })
      // Map to extract just the userIds
      // Flatten the arrays of users into a single array and create a unique set
      const uniqueUserIds = Array.from(new Set(users.flatMap((pm) => pm.users)))

      // Get username corresponding to the PM who created the task
      // it will always be one user to create so link to that projectMember
      const createdByUsername = task.createdBy.users[0] ? task.createdBy.users[0].username : null

      await sendNotification(
        {
          templateId: "taskAssigned",
          recipients: uniqueUserIds,
          data: { taskName: name, createdBy: createdByUsername, deadline: deadline },
          projectId: projectId,
        },
        ctx
      )
    }

    return task
  }
)
