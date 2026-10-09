import { resolver } from "@blitzjs/rpc"
import db from "db"

import { NotFoundError } from "blitz"
import { getProjectAccess } from "src/projectprivileges/utils/getProjectAccess"
import { hideOthersResponses } from "src/projectprivileges/utils/hideOthersResponses"
const getTaskTags = resolver.pipe(
  resolver.authorize(),
  async ({ projectId }: { projectId: number }, ctx) => {
    const userId = ctx.session.userId as number
    const access = await getProjectAccess(userId)
    if (!access.memberProjectIds.includes(projectId)) throw new NotFoundError()
    const tasks = await db.task.findMany({
      where: { projectId },
      include: {
        container: true,
        taskLogs: {
          include: {
            comments: true,
          },
        },
      },
    })

    return hideOthersResponses(tasks, userId, access)
  }
)

export default getTaskTags
