import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Status } from "@prisma/client"
import moment from "moment"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const today = moment().startOf("day")
  const currentUser = ctx.session.userId // Ensure userId is accessible from ctx

  // Fetch the task logs
  const allTaskLogs = await db.taskLog.findMany({
    where: {
      assignedToId: currentUser, // Filtering based on the current user's ID
    },
    include: {
      task: {
        include: {
          project: true, // Include the project through the task relation
        },
      },
    },
  })

  // Filter and categorize tasks, sort by date
  const taskLogs = allTaskLogs
    .filter((taskLog) => taskLog.status === Status.NOT_COMPLETED)
    .sort((a, b) => {
      // Sort by createdAt in descending order
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const upcomingTasks = taskLogs
    .filter((taskLog) => {
      if (taskLog.task.deadline) {
        return moment(taskLog.task.deadline).isSameOrAfter(today, "day")
      }
      return false
    })
    .slice(0, 3) // top three rows

  const pastDueTasks = taskLogs
    .filter((taskLog) => {
      if (taskLog.task.deadline) {
        return moment(taskLog.task.deadline).isBefore(moment(), "minute")
      }
      return false
    })
    .slice(0, 3) // top three rows

  return {
    taskLogs,
    upcomingTasks,
    pastDueTasks,
  }
})
