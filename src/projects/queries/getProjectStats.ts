import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
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

    return {
      allContributor: allContributor,
      allTask: allTask,
      // completedTask: ,
      allTeams: allTeams,
    }
  }
)
