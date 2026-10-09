import { resolver } from "@blitzjs/rpc"
import db from "db"

import { NotFoundError } from "blitz"
import { getProjectAccess } from "src/projectprivileges/utils/getProjectAccess"
import { hideOthersResponses } from "src/projectprivileges/utils/hideOthersResponses"
const getPeopleTags = resolver.pipe(
  resolver.authorize(),
  async ({ projectId }: { projectId: number }, ctx) => {
    const userId = ctx.session.userId as number
    const access = await getProjectAccess(userId)
    if (!access.memberProjectIds.includes(projectId)) throw new NotFoundError()
    const projectMember = await db.projectMember.findMany({
      where: { projectId },
      include: {
        users: true,
        roles: true,
        assignedTasks: {
          include: {
            roles: true,
            taskLogs: true,
          },
        },
      },
    })

    return hideOthersResponses(projectMember, userId, access)
  }
)

export default getPeopleTags
