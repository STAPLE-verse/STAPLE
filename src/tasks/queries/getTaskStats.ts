import { resolver } from "@blitzjs/rpc"
import db, { Status, MemberPrivileges } from "db"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
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

      // Completion based on task.status
      const completedTask = await db.task.count({
        where: { projectId: projectId, status: Status.COMPLETED },
      })

      const newCommentsCount = await db.commentReadStatus.count({
        where: {
          projectMember: {
            projectId: projectId,
            users: {
              some: { id: userId as number },
            },
          },
          read: false,
        },
      })

      return {
        allTask,
        completedTask,
        newCommentsCount,
      }
    } else if (privilege === MemberPrivileges.CONTRIBUTOR) {
      // If CONTRIBUTOR, return only tasks assigned to the projectMember
      const taskLogs = await db.taskLog.findMany({
        where: {
          task: { projectId: projectId },
          assignedTo: {
            users: {
              some: { id: userId },
            },
          },
        },
        include: {
          task: true,
        },
        orderBy: {
          createdAt: "desc", // Ensure latest logs are fetched
        },
      })

      // Get only the latest log for each task / projectmember
      const latestTaskLogs = await getLatestTaskLogs(taskLogs)

      const taskLogIds = latestTaskLogs.map((log) => log.id)

      const newCommentsCount = await db.commentReadStatus.count({
        where: {
          comment: {
            taskLogId: { in: taskLogIds },
          },
          projectMember: {
            users: {
              some: { id: userId },
            },
          },
          read: false,
        },
      })

      // Get the completed logs
      const projectTaskLogs = latestTaskLogs.filter((taskLog) => {
        return taskLog.status === Status.COMPLETED
      })

      const allTask = latestTaskLogs.length

      // Completion based on latest assignment status
      const completedTask = projectTaskLogs.length

      return {
        allTask,
        completedTask,
        newCommentsCount,
      }
    }

    throw new Error("Invalid privilege")
  }
)
