import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetProjectsInput
  extends Pick<Prisma.ProjectFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100, include }: GetProjectsInput) => {
    const {
      items: projects,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.project.count({ where }),
      query: (paginateArgs) =>
        db.project.findMany({
          ...paginateArgs,
          where,
          orderBy,
          ...(include ? { include } : {}), // Conditionally apply include
        }),
    })

    return {
      projects,
      nextPage,
      hasMore,
      count,
    }
  }
)
