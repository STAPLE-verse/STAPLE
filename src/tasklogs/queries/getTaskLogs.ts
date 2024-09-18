import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

// Define input types for the query
interface GetTaskLogsInput
  extends Pick<Prisma.TaskLogFindManyArgs, "where" | "orderBy" | "include"> {}

export default resolver.pipe(
  resolver.authorize(), // Automatically handles authorization
  async ({ where, orderBy, include }: GetTaskLogsInput) => {
    const taskLogs = await db.taskLog.findMany({
      where,
      orderBy,
      include,
    })

    return taskLogs || []
  }
)
