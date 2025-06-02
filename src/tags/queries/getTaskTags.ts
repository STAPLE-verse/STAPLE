import { resolver } from "@blitzjs/rpc"
import db from "db"

const getTaskTags = resolver.pipe(
  resolver.authorize(),
  async ({ projectId }: { projectId: number }) => {
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

    return tasks
  }
)

export default getTaskTags
