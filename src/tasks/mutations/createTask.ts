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
      teamsId,
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
            user: true,
          },
        },
      },
    })

    //Connect to roles
    let task1 = await db.task.update({
      where: { id: task.id },
      data: {
        roles: {
          connect: rolesId?.map((c) => ({ id: c })) || [],
        },
      },
    })

    // Get username corresponding to the PM who created the task
    const createdByUsername = task.createdBy.user ? task.createdBy.user.username : null

    // Create the assignment
    if (projectMembersId != null && projectMembersId.length != 0) {
      // Fetch User IDs corresponding to the Contributor IDs
      const users = await db.projectMember.findMany({
        where: {
          id: { in: projectMembersId },
        },
        select: {
          userId: true, // Only select the userId field
        },
      })
      // Map to extract just the userIds
      const userIds = users.map((u) => u.userId)

      projectMembersId.forEach(async (projectMemberId) => {
        // Create the assignment
        const assignment = await db.assignment.create({
          data: {
            task: { connect: { id: task.id } },
            projectMember: { connect: { id: projectMemberId } },
          },
        })
        // Create assignment status log
        await db.assignmentStatusLog.create({
          data: {
            assignmentId: assignment.id,
          },
        })
      })
      // Send notification to the projectMembers
      await sendNotification(
        {
          templateId: "taskAssigned",
          recipients: userIds,
          data: { taskName: name, createdBy: createdByUsername, deadline: deadline },
          projectId: projectId,
        },
        ctx
      )
    }

    if (teamsId != null && teamsId.length != 0) {
      // Fetch User IDs corresponding to the Contributor IDs
      const teams = await db.team.findMany({
        where: {
          id: {
            in: teamsId,
          },
        },
        include: {
          projectMembers: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
      // Map to extract just the userIds
      const userIds = teams.flatMap((team) =>
        team.projectMembers.map((projectMember) => projectMember.user.id)
      )

      teamsId.forEach(async (teamId) => {
        // Create the assignment
        const assignment = await db.assignment.create({
          data: {
            task: { connect: { id: task.id } },
            team: { connect: { id: teamId } },
          },
        })
        // Create assignment status log
        await db.assignmentStatusLog.create({
          data: {
            assignmentId: assignment.id,
            completedAs: CompletedAs.TEAM,
          },
        })
      })
      // Send notification to the projectMembers
      await sendNotification(
        {
          templateId: "taskAssigned",
          recipients: userIds,
          data: { taskName: name, createdBy: createdByUsername, deadline: deadline },
          projectId: projectId,
        },
        ctx
      )
    }

    return task
  }
)
