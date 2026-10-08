import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { paginate } from "blitz"
import { getProjectAccess, ProjectAccess } from "src/projectprivileges/utils/getProjectAccess"

// Define input types for the query
interface GetTaskLogsInput
  extends Pick<Prisma.TaskLogFindManyArgs, "where" | "orderBy" | "include" | "skip" | "take"> {}

// Form responses are only for the people they concern: project managers see them for their
// projects, and everyone else only for logs assigned to them or to a team they are on. Other
// logs are still returned (status, approval and dates feed summaries) with the response blanked.
async function hideOthersResponses<T extends { id: number }>(
  taskLogs: T[],
  userId: number,
  access: ProjectAccess
): Promise<T[]> {
  if (taskLogs.length === 0) return taskLogs
  const owners = await db.taskLog.findMany({
    where: { id: { in: taskLogs.map((log) => log.id) } },
    select: {
      id: true,
      task: { select: { projectId: true } },
      assignedTo: { select: { users: { select: { id: true } } } },
    },
  })
  const mayRead = new Set(
    owners
      .filter(
        (log) =>
          access.managerProjectIds.includes(log.task.projectId) ||
          log.assignedTo.users.some((user) => user.id === userId)
      )
      .map((log) => log.id)
  )
  return taskLogs.map((log) =>
    mayRead.has(log.id) || !("metadata" in log) ? log : { ...log, metadata: null }
  )
}

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

      const taskLogs = await hideOthersResponses(foundLogs, userId, access)
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

    const taskLogs = await hideOthersResponses(foundLogs, userId, access)
    return {
      taskLogs,
      nextPage,
      hasMore,
      count,
    }
  }
)
