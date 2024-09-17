import { resolver } from "@blitzjs/rpc"
import { Ctx } from "blitz"
import { Status } from "db"
import moment from "moment"

import getTasks from "./getTasks"

export default resolver.pipe(resolver.authorize(), async (undefined, ctx: Ctx) => {
  const today = moment().startOf("day")

  const { tasks } = await getTasks(
    {
      include: {
        project: { select: { name: true } },
      },
      where: {
        assignees: { some: { projectMember: { user: { id: ctx.session.userId as number } } } },
        status: Status.NOT_COMPLETED,
      },
      orderBy: { id: "desc" },
    },
    ctx
  )

  const upcomingTasks = tasks.filter((task) => {
    if (task && task.deadline) {
      return moment(task.deadline).isSameOrAfter(today, "day")
    }
    return false
  })

  // get pastDue
  const pastDueTasks = tasks.filter((task) => {
    if (task && task.deadline) {
      return moment(task.deadline).isBefore(moment(), "minute")
    }
    return false
  })

  return {
    tasks,
    upcomingTasks,
    pastDueTasks,
  }
})
