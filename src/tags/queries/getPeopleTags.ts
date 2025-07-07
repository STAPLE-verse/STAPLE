import { resolver } from "@blitzjs/rpc"
import db from "db"

const getPeopleTags = resolver.pipe(
  resolver.authorize(),
  async ({ projectId }: { projectId: number }) => {
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

    return projectMember
  }
)

export default getPeopleTags
