import { resolver } from "@blitzjs/rpc"
import db from "db"

import { NotFoundError } from "blitz"
import { getProjectAccess } from "src/projectprivileges/utils/getProjectAccess"
import { hideOthersResponses } from "src/projectprivileges/utils/hideOthersResponses"
const getMilestoneTags = resolver.pipe(
  resolver.authorize(),
  async ({ projectId }: { projectId: number }, ctx) => {
    const userId = ctx.session.userId as number
    const access = await getProjectAccess(userId)
    if (!access.memberProjectIds.includes(projectId)) throw new NotFoundError()
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

    return hideOthersResponses(milestones, userId, access)
  }
)

export default getMilestoneTags
