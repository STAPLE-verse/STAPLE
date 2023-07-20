import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetTasksInput
  extends Pick<Prisma.TaskFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetTasksInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: tasks,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.task.count({ where }),
      query: (paginateArgs) => db.task.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      tasks,
      nextPage,
      hasMore,
      count,
    }
  }
)
