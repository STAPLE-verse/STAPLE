import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { paginate } from "blitz"

// Define input types for the query
interface GetTaskLogsInput
  extends Pick<Prisma.TaskLogFindManyArgs, "where" | "orderBy" | "include" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(), // Automatically handles authorization
  async ({ where, orderBy, include, skip = 0, take }: GetTaskLogsInput) => {
    if (typeof take !== "number") {
      const [taskLogs, count] = await Promise.all([
        db.taskLog.findMany({
          where,
          orderBy,
          include,
          skip,
        }),
        db.taskLog.count({ where }),
      ])

      return {
        taskLogs,
        nextPage: null,
        hasMore: false,
        count,
      }
    }

    const {
      items: taskLogs,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.taskLog.count({ where }),
      query: (paginateArgs) =>
        db.taskLog.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include,
        }),
    })

    return {
      taskLogs,
      nextPage,
      hasMore,
      count,
    }
  }
)
