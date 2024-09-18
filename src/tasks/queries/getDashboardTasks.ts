import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Status, Task, TaskLog } from "@prisma/client"
import moment from "moment"
import { Ctx } from "blitz"

type TaskLogWithTask = TaskLog & {
  task: Task
}

type DashboardTasksResponse = {
  taskLogs: TaskLogWithTask[]
  upcomingTasks: TaskLogWithTask[]
  pastDueTasks: TaskLogWithTask[]
}

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const today = moment().startOf("day")
  const currentUser = ctx.session.userId // Ensure userId is accessible from ctx

  // Fetch the task logs
  const allTaskLogs = await db.taskLog.findMany({
    where: {
      assignedToId: currentUser, // Filtering based on the current user's ID
    },
    include: {
      task: true, // Ensure task is included
    },
  })

  // Filter and categorize tasks
  const taskLogs = allTaskLogs.filter((taskLog) => taskLog.status === Status.NOT_COMPLETED)

  const upcomingTasks = taskLogs.filter((taskLog) => {
    if (taskLog.task.deadline) {
      return moment(taskLog.task.deadline).isSameOrAfter(today, "day")
    }
    return false
  })

  const pastDueTasks = taskLogs.filter((taskLog) => {
    if (taskLog.task.deadline) {
      return moment(taskLog.task.deadline).isBefore(moment(), "minute")
    }
    return false
  })

  return {
    taskLogs,
    upcomingTasks,
    pastDueTasks,
  }
})
