import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetContributorsInput
  extends Pick<Prisma.ContributorFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetContributorsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: contributors,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.contributor.count({ where }),
      query: (paginateArgs) => db.contributor.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      contributors,
      nextPage,
      hasMore,
      count,
    }
  }
)
