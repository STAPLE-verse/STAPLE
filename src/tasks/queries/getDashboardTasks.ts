import { resolver } from "@blitzjs/rpc"
import { Ctx } from "blitz"
import { Status, TaskLog } from "db"
import moment from "moment"

import { getLatestTaskLog } from "src/tasklogs/utils/getLatestTaskLog"

export default resolver.pipe(resolver.authorize(), async (undefined, ctx: Ctx) => {
  const today = moment().startOf("day")

  const alltaskLogs = await getLatestTaskLog(ctx)

  const taskLogs = (alltaskLogs as TaskLog[]).filter((taskLog) => {
    return taskLog.status === Status.NOT_COMPLETED
  })

  const upcomingTasks = taskLogs.filter((taskLog) => {
    if (taskLog && taskLog.task.deadline) {
      return moment(taskLog.task.deadline).isSameOrAfter(today, "day")
    }
    return false
  })

  // get pastDue
  const pastDueTasks = taskLogs.filter((taskLog) => {
    if (taskLog && taskLog.task.deadline) {
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
