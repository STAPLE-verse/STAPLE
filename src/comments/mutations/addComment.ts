import { Routes } from "@blitzjs/next"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import sendNotification from "src/notifications/mutations/sendNotification"
import { z } from "zod"

const AddCommentSchema = z.object({
  taskLogId: z.number(),
  projectMemberId: z.number(),
  content: z.string().min(1, "Comment cannot be empty"),
})

export default resolver.pipe(
  resolver.zod(AddCommentSchema),
  resolver.authorize(),
  async ({ taskLogId, projectMemberId, content }, ctx) => {
    const userId = ctx.session.userId
    if (!userId) throw new Error("User not authenticated")

    // Create a new comment and ensure the author includes users
    const comment = await db.comment.create({
      data: {
        taskLogId,
        authorId: projectMemberId,
        content,
      },
      include: {
        author: {
          include: {
            users: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    // Fetch TaskLog with Assigned Members & Project Info
    const taskLog = await db.taskLog.findUnique({
      where: { id: taskLogId },
      include: {
        assignedTo: {
          include: {
            users: { select: { id: true } },
          },
        },
        task: {
          select: {
            id: true,
            name: true,
            projectId: true,
          },
        },
      },
    })

    if (!taskLog) throw new Error("TaskLog not found")

    const projectId = taskLog.task.projectId

    // Fetch Project Managers
    const projectManagers = await db.projectPrivilege.findMany({
      where: {
        projectId: projectId,
        privilege: "PROJECT_MANAGER",
      },
      include: {
        user: { select: { id: true } },
      },
    })

    // Send notification
    const assignedUserIds = taskLog.assignedTo.users.map((user) => user.id)
    const projectManagerIds = projectManagers.map((manager) => manager.user.id)

    const uniqueRecipientIds = Array.from(new Set([...assignedUserIds, ...projectManagerIds]))

    await sendNotification(
      {
        templateId: "commentMade",
        recipients: uniqueRecipientIds,
        data: {
          taskName: taskLog.task.name,
          createdBy: comment.author.users[0]?.username || "Unknown",
        },
        projectId: projectId,
        routeData: {
          path: Routes.ShowTaskPage({
            projectId: projectId,
            taskId: taskLog.task.id,
          }).href,
        },
      },
      ctx
    )

    return comment
  }
)
