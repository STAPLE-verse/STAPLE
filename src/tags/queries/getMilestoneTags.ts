import { resolver } from "@blitzjs/rpc"
import db from "db"

const getMilestoneTags = resolver.pipe(
  resolver.authorize(),
  async ({ projectId }: { projectId: number }) => {
    const milestones = await db.milestone.findMany({
      where: { projectId },
      include: {
        task: {
          include: {
            taskLogs: true,
            roles: true,
          },
        },
      },
    })

    return milestones
  }
)

export default getMilestoneTags
