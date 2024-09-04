import { resolver } from "@blitzjs/rpc"
import db, { TaskStatus, ContributorPrivileges, AssignmentStatus } from "db"
import { getLatestStatusLog } from "src/assignments/utils/getLatestStatusLog"
import { z } from "zod"

const GetTaskStatsSchema = z.object({
  projectId: z.number(),
  privilege: z.enum([ContributorPrivileges.PROJECT_MANAGER, ContributorPrivileges.CONTRIBUTOR]),
})

export default resolver.pipe(
  resolver.zod(GetTaskStatsSchema),
  resolver.authorize(),
  async ({ projectId, privilege }, ctx) => {
    const userId = ctx.session.userId

    // Get contributorId based on userId and projectId
    const contributor = await db.contributor.findFirst({
      where: {
        userId,
        projectId: projectId,
      },
    })

    if (!contributor) {
      throw new Error("Contributor not found for this project")
    }

    if (privilege === ContributorPrivileges.PROJECT_MANAGER) {
      // If PROJECT_MANAGER, return all tasks for the project
      const allTask = await db.task.count({
        where: { projectId: projectId },
      })

      // Completition based on task.status
      const completedTask = await db.task.count({
        where: { projectId: projectId, status: TaskStatus.COMPLETED },
      })

      return {
        allTask,
        completedTask,
      }
    } else if (privilege === ContributorPrivileges.CONTRIBUTOR) {
      // If CONTRIBUTOR, return only tasks assigned to the contributor
      const tasks = await db.task.findMany({
        where: { projectId: projectId },
        include: {
          assignees: {
            where: { contributorId: contributor.id },
            include: { statusLogs: true },
          },
        },
      })

      const allTask = tasks.length

      // Completition based on latest assignment status
      const completedTask = tasks.reduce((count, task) => {
        const latestStatusLog = getLatestStatusLog(task.assignees[0]?.statusLogs)

        if (latestStatusLog?.status === AssignmentStatus.COMPLETED) {
          return count + 1
        }

        return count
      }, 0)

      return {
        allTask,
        completedTask,
      }
    }

    throw new Error("Invalid privilege")
  }
)
