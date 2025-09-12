import { Routes } from "@blitzjs/next"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import sendNotification from "src/notifications/mutations/sendNotification"
import { z } from "zod"

export const UpdateTaskLogApprovalSchema = z.object({
  id: z.number(),
  approved: z.boolean().nullable(),
  completedById: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateTaskLogApprovalSchema),
  resolver.authorize(),
  async ({ id, approved, completedById }, ctx) => {
    //get the tasklog and update it
    const currentTaskLog = await db.taskLog.findUnique({ where: { id: id } })
    if (!currentTaskLog) {
      throw new Error("taskLogId to be updated not found.")
    }
    // Find the taskLog to be updated
    const taskLog = await db.taskLog.update({
      where: { id },
      data: { approved },
    })

    // get the task for information for the notification
    const task = await db.task.findUnique({ where: { id: currentTaskLog!.taskId } })
    // Get the projectMember assignedTo the taskLog
    const assignedTo = await db.projectMember.findUnique({
      where: { id: currentTaskLog!.assignedToId },
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

    const statusText =
      approved === null ? "Pending" : approved === true ? "Approved" : "Not Approved"

    await sendNotification(
      {
        templateId: "changedAssignment",
        recipients: userIds!,
        data: {
          taskName: task!.name,
          completedBy: completedByUsername,
          assignmentStatus: statusText, // Include the approved status as text
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
