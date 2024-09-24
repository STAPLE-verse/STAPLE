import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTaskSchema } from "../schemas"
import sendNotification from "src/notifications/mutations/sendNotification"

export default resolver.pipe(
  resolver.zod(CreateTaskSchema),
  resolver.authorize(),
  async (
    {
      name,
      projectId,
      containerId,
      formVersionId,
      description,
      elementId,
      deadline,
      createdById,
      projectMembersId,
      teamsId,
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

    const combinedIds = [...(projectMembersId ? projectMembersId : []), ...(teamsId ? teamsId : [])]

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
        assignedMembers: {
          connect: combinedIds ? combinedIds.map((id) => ({ id })) : [],
        },
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
    if (rolesId && rolesId.length > 0) {
      await db.task.update({
        where: { id: task.id },
        data: {
          roles: {
            connect: rolesId.map((c) => ({ id: c })),
          },
        },
      })
    }

    // create initial statusLogs
    if (combinedIds != null && combinedIds.length != 0) {
      combinedIds.forEach(async (projectMemberId) => {
        // figure out if team or individual based on name null
        const projectMember = await db.projectMember.findUnique({
          where: { id: projectMemberId },
        })

        // Determine if it's a team or individual based on the name null
        const completedAsData = projectMember?.name === null ? "TEAM" : "INDIVIDUAL"

        // Create the taskLog
        await db.taskLog.create({
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
          id: { in: combinedIds },
        },
        select: {
          users: true, // Only select the userId field
        },
      })
      // Map to extract just the userIds
      const uniqueUserIds = Array.from(
        new Set(users.flatMap((pm) => pm.users.map((user) => user.id))) // Map over the users array to extract ids
      )

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
