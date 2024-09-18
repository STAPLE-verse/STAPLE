import { resolver, useQuery } from "@blitzjs/rpc"
import db, { Status, MemberPrivileges, TaskLog } from "db"
import { getLatestTaskLog } from "src/tasklogs/utils/getLatestTaskLog"
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
    const projectPrivilege = await db.projectPrivilege.findFirst({
      where: {
        userId: userId,
        projectId: projectId,
      },
    })

    if (!projectPrivilege) {
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
      const allTaskLogs = await getLatestTaskLog(userId, ctx)

      const projectTaskLogs = allTaskLogs
        .filter((taskLog) => {
          return taskLog.status === Status.NOT_COMPLETED && taskLog.task.projectId === projectId
        })
        .sort((a, b) => {
          // Sort by createdAt in descending order
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

      const allTask = allTaskLogs.length

      // Completition based on latest assignment status
      const completedTask = projectTaskLogs.length

      return {
        allTask,
        completedTask,
      }
    }

    throw new Error("Invalid privilege")
  }
)
