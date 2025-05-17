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

    const createdByUsername = comment.author.users[0]
      ? comment.author.users[0].firstName && comment.author.users[0].lastName
        ? `${comment.author.users[0].firstName} ${comment.author.users[0].lastName}`
        : comment.author.users[0].username
      : "Unknown"

    await sendNotification(
      {
        templateId: "commentMade",
        recipients: assignedUserIds,
        data: {
          taskName: taskLog.task.name,
          createdBy: createdByUsername,
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

    const projectManagerIds = projectManagers.map((manager) => manager.user.id)

    await sendNotification(
      {
        templateId: "commentMade",
        recipients: projectManagerIds,
        data: {
          taskName: taskLog.task.name,
          createdBy: createdByUsername,
        },
        projectId: projectId,
        routeData: {
          path: Routes.TaskLogsPage({
            projectId: projectId,
            taskId: taskLog.task.id,
          }).href,
        },
      },
      ctx
    )

    // Merge assigned and manager user IDs
    const allRelevantUserIds = [...assignedUserIds, ...projectManagerIds]

    // Find corresponding ProjectMember records
    const relevantProjectMembers = await db.projectMember.findMany({
      where: {
        id: { in: allRelevantUserIds },
        projectId: projectId,
      },
    })

    // Create CommentReadStatus records
    await db.commentReadStatus.createMany({
      data: relevantProjectMembers.map((member) => ({
        commentId: comment.id,
        projectMemberId: member.id,
        read: member.id === projectMemberId,
      })),
    })

    return comment
  }
)
