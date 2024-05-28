import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { TaskStatus } from "db"
import { z } from "zod"

const GetProjectStatsSchema = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetProjectStatsSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const allTask = await db.task.count({
      where: { projectId: id },
    })

    const allContributor = await db.contributor.count({
      where: { projectId: id },
    })

    const allTeams = await db.team.count({
      where: { projectId: id },
    })

    const completedTask = await db.task.count({
      where: {
        projectId: id,
        status: TaskStatus.NOT_COMPLETED,
      },
    })

    const allElements = await db.element.count({
      where: {
        projectId: id,
      },
    })

    const allForms = await db.task.count({
      where: {
        projectId: id,
        //schema: true
        //statusLogs: { metadata: true } where the metadata isn't empty
      },
    })

    const completedForms = await db.task.count({
      where: {
        projectId: id,
        schema: undefined!, // schema must be defined
        //assignees: { statusLogs: { status: { AssignmentStatus.NOT_COMPLETED } } },
      },
    })

    const completedContribLabels = await db.contributor.count({
      where: {
        projectId: id,
        labels: undefined, // labels are empty
      },
    })

    const completedTaskLabels = await db.task.count({
      where: {
        projectId: id,
        labels: undefined,
      },
    })

    return {
      allContributor: allContributor,
      allTask: allTask,
      completedTask: completedTask,
      allTeams: allTeams,
      allElements: allElements,
      allForms: allForms,
      completedForms: completedForms,
      completedContribLabels: completedContribLabels,
      completedTaskLabels: completedTaskLabels,
    }
  }
)
