import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetProjectsInput
  extends Pick<Prisma.ProjectFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take, include }: GetProjectsInput) => {
    if (typeof take !== "number") {
      const [projects, count] = await Promise.all([
        db.project.findMany({
          where,
          orderBy,
          skip,
          ...(include ? { include } : {}),
        }),
        db.project.count({ where }),
      ])

      return { projects, nextPage: null, hasMore: false, count }
    }

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
