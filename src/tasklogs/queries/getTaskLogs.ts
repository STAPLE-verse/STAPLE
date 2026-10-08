import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { paginate } from "blitz"
import { getProjectAccess } from "src/projectprivileges/utils/getProjectAccess"
import { hideOthersResponses } from "src/projectprivileges/utils/hideOthersResponses"

// Define input types for the query
interface GetTaskLogsInput
  extends Pick<Prisma.TaskLogFindManyArgs, "where" | "orderBy" | "include" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(), // Automatically handles authorization
  async ({ where: requestedWhere, orderBy, include, skip = 0, take }: GetTaskLogsInput, ctx) => {
    const userId = ctx.session.userId as number
    const access = await getProjectAccess(userId)

    // The filter comes from the browser, so it is always narrowed to the user's own projects
    const inMyProjects: Prisma.TaskLogWhereInput = {
      task: { projectId: { in: access.memberProjectIds } },
    }
    const where: Prisma.TaskLogWhereInput = requestedWhere
      ? { AND: [requestedWhere, inMyProjects] }
      : inMyProjects

    if (typeof take !== "number") {
      const [foundLogs, count] = await Promise.all([
        db.taskLog.findMany({
          where,
          orderBy,
          include,
          skip,
        }),
        db.taskLog.count({ where }),
      ])

      const taskLogs = await hideOthersResponses(foundLogs, userId, access, { rootAreLogs: true })
      return {
        taskLogs,
        nextPage: null,
        hasMore: false,
        count,
      }
    }

    const {
      items: foundLogs,
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

    const taskLogs = await hideOthersResponses(foundLogs, userId, access, { rootAreLogs: true })
    return {
      taskLogs,
      nextPage,
      hasMore,
      count,
    }
  }
)
