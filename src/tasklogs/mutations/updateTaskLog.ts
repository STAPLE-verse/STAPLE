import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTaskLogSchema } from "../schemas"
import sendNotification from "src/notifications/mutations/sendNotification"
import { getStatusText } from "src/core/utils/getStatusText"
import { Routes } from "@blitzjs/next"

export default resolver.pipe(
  resolver.zod(CreateTaskLogSchema),
  resolver.authorize(),
  async ({ id, metadata, status, completedById, completedAs }, ctx) => {
    // Get current taskLog to be updated
    const currentTaskLog = await db.taskLog.findUnique({ where: { id: id } })

    if (!currentTaskLog) {
      throw new Error("taskLogId to be updated not found.")
    }
    // Create the taskLog
    const taskLog = await db.taskLog.create({
      data: {
        // Old values
        task: { connect: { id: currentTaskLog.taskId } },
        assignedTo: { connect: { id: currentTaskLog.assignedToId } },
        // New values
        completedBy: { connect: { id: completedById } },
        metadata,
        status,
        completedAs,
      },
    })

    // Send notification
    // Get information for the notification
    // Get the task for name
    const task = await db.task.findUnique({ where: { id: currentTaskLog.taskId } })
    // Get the projectMember assignedTo the taskLog
    const assignedTo = await db.projectMember.findUnique({
      where: { id: currentTaskLog.assignedToId },
      include: {
        users: true,
      },
    })

    // Get the userIds
    const userIds = assignedTo?.users.map((user) => user.id)

    // Get the projectMember who completed it
    const completedBy = await db.projectMember.findUnique({
      where: { id: completedById },
      include: {
        users: true,
      },
    })

    const completedByUsername = completedBy?.users?.[0]
      ? completedBy.users[0].firstName && completedBy.users[0].lastName
        ? `${completedBy.users[0].firstName} ${completedBy.users[0].lastName}`
        : completedBy.users[0].username
      : "Unknown User"

    await sendNotification(
      {
        templateId: "changedAssignment",
        recipients: userIds!,
        data: {
          taskName: task!.name,
          completedBy: completedByUsername,
          assignmentStatus: getStatusText(status),
        },
        projectId: task!.projectId,
        routeData: {
          path: Routes.ShowTaskPage({
            projectId: task!.projectId,
            taskId: task!.id,
          }).href,
        },
      },
      ctx
    )

    return taskLog
  }
)
