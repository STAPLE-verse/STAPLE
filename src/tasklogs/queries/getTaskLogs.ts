import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetTaskLogsInput
  extends Pick<Prisma.TaskLogFindManyArgs, "where" | "orderBy" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include }: GetTaskLogsInput) => {
    const taskLogs = await db.taskLog.findMany({
      where,
      orderBy,
      include,
    })

    return taskLogs || []
  }
)
