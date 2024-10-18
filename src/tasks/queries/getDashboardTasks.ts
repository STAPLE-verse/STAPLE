import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Status } from "@prisma/client"
import moment from "moment"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const today = moment().startOf("day")
  const currentUser = ctx.session.userId // Get the current userId

  // Step 1: Fetch tasks assigned to the current user
  const assignedTasks = await db.task.findMany({
    where: {
      assignedMembers: {
        some: {
          users: {
            some: {
              id: currentUser, // Filter by user's assigned tasks
            },
          },
        },
      },
    },
    include: {
      taskLogs: true, // Include all task logs for each task
      project: true, // Optionally include the project
    },
  })

  // Step 2: For each task, find the latest taskLog
  const tasksWithLatestLogs = assignedTasks.map((task) => {
    const latestTaskLog = task.taskLogs.reduce((latest, current) => {
      return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
    })

    return {
      ...task,
      latestTaskLog,
    }
  })

  // Step 3: Filter and categorize tasks based on the latest taskLog status
  const upcomingTasks = tasksWithLatestLogs
    .filter((task) => {
      return (
        task.latestTaskLog.status === Status.NOT_COMPLETED &&
        task.deadline &&
        moment(task.deadline).isSameOrAfter(today, "day")
      )
    })
    .slice(0, 3) // Limit to top 3

  const pastDueTasks = tasksWithLatestLogs
    .filter((task) => {
      return (
        task.latestTaskLog.status === Status.NOT_COMPLETED &&
        task.deadline &&
        moment(task.deadline).isBefore(today, "minute")
      )
    })
    .slice(0, 3) // Limit to top 3

  return {
    upcomingTasks,
    pastDueTasks,
  }
})
