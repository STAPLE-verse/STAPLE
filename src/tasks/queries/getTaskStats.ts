import { resolver } from "@blitzjs/rpc"
import db, { Status, MemberPrivileges, AssignmentStatus } from "db"
import { getLatestStatusLog } from "src/tasklogs/utils/getLatestStatusLog"
import { z } from "zod"

const GetTaskStatsSchema = z.object({
  projectId: z.number(),
  privilege: z.enum([MemberPrivileges.PROJECT_MANAGER, MemberPrivileges.CONTRIBUTOR]),
})

export default resolver.pipe(
  resolver.zod(GetTaskStatsSchema),
  resolver.authorize(),
  async ({ projectId, privilege }, ctx) => {
    const userId = ctx.session.userId

    // Get projectMemberId based on userId and projectId
    const projectMember = await db.projectMember.findFirst({
      where: {
        userId,
        projectId: projectId,
      },
    })

    if (!projectMember) {
      throw new Error("Contributor not found for this project")
    }

    if (privilege === MemberPrivileges.PROJECT_MANAGER) {
      // If PROJECT_MANAGER, return all tasks for the project
      const allTask = await db.task.count({
        where: { projectId: projectId },
      })

      // Completition based on task.status
      const completedTask = await db.task.count({
        where: { projectId: projectId, status: Status.COMPLETED },
      })

      return {
        allTask,
        completedTask,
      }
    } else if (privilege === MemberPrivileges.CONTRIBUTOR) {
      // If CONTRIBUTOR, return only tasks assigned to the projectMember
      const tasks = await db.task.findMany({
        where: { projectId: projectId },
        include: {
          assignees: {
            where: { projectMemberId: projectMember.id },
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
