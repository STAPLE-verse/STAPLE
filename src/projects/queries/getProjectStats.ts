import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Status } from "db"
import { z } from "zod"

const GetProjectStatsSchema = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetProjectStatsSchema),
  resolver.authorize(),
  async ({ id }) => {
    const allTask = await db.task.count({
      where: { projectId: id },
    })

    // just single users
    const allProjectMember = await db.projectMember.count({
      where: {
        projectId: id,
        users: {
          every: {
            id: { not: undefined }, // Ensures there's at least one user
          },
        },
        deleted: false,
        name: null, // Ensures the name in ProjectMember is null
      },
    })

    // get teams with a name
    const allTeams = await db.projectMember.count({
      where: {
        projectId: id,
        name: { not: null }, // Ensures the name in ProjectMember is non-null
        users: {
          some: { id: { not: undefined } }, // Ensures there's at least one user
        },
      },
    })

    const completedTask = await db.task.count({
      where: {
        projectId: id,
        status: Status.COMPLETED,
      },
    })

    const allMilestones = await db.milestone.count({
      where: {
        projectId: id,
      },
    })

    // get all tasks with schema
    const taskForms = await db.task.findMany({
      where: {
        projectId: id,
        formVersionId: { not: null },
      },
    })

    // grab the last task log for each projectMember + task
    const taskLogForms = await Promise.all(
      taskForms.map(async (task) => {
        // Fetch the distinct assignedToId values for the task
        const distinctAssignedToIds = await db.taskLog.findMany({
          where: {
            taskId: task.id,
          },
          select: { assignedToId: true },
          distinct: ["assignedToId"], // Ensure distinct assignedToId values
        })

        // Fetch the latest TaskLog for each distinct assignedToId
        const taskLogs = await Promise.all(
          distinctAssignedToIds.map(async (assignedTo) => {
            const latestTaskLog = await db.taskLog.findFirst({
              where: {
                taskId: task.id,
                assignedToId: assignedTo.assignedToId,
              },
              orderBy: { createdAt: "desc" }, // Get the latest log by creation date
            })
            return latestTaskLog
          })
        )

        return { ...task, latestTaskLogs: taskLogs }
      })
    )

    // Flatten all the latest taskLogs across all tasks
    const allTaskLogs = taskLogForms.flatMap((task) => task.latestTaskLogs)

    // Filter the completed task logs
    const completedTaskLogs = allTaskLogs.filter((log) => log?.status === Status.COMPLETED)

    // no roles for projectMembers
    const contribRoles = await db.projectMember.findMany({
      where: {
        projectId: id,
      },
      include: { roles: true },
    })

    const completedContribRoles = contribRoles.filter((role) => role.roles.length > 0)

    // no roles for tasks
    const taskRoles = await db.task.findMany({
      where: {
        projectId: id,
      },
      include: { roles: true },
    })

    const completedTaskRoles = taskRoles.filter((role) => role.roles.length > 0)

    return {
      allProjectMember: allProjectMember,
      allTask: allTask,
      completedTask: completedTask,
      allTeams: allTeams,
      allMilestones: allMilestones,
      completedContribRoles: completedContribRoles.length,
      completedTaskRoles: completedTaskRoles.length,
      allTaskLogs: allTaskLogs.length,
      completedTaskLogs: completedTaskLogs.length,
    }
  }
)
