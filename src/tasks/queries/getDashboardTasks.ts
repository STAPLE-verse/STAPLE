import { resolver } from "@blitzjs/rpc"
import { Ctx } from "blitz"
import { Status, TaskLog } from "db"
import moment from "moment"
import { getLatestTaskLog } from "src/tasklogs/utils/getLatestTaskLog"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

export default resolver.pipe(resolver.authorize(), async (ctx: Ctx) => {
  const today = moment().startOf("day")

  const currentUser = useCurrentUser()

  const allTaskLogs = await getLatestTaskLog(currentUser!.id, ctx)

  const taskLogs = (allTaskLogs as TaskLog[]).filter((taskLog) => {
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
