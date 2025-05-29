import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { paginate } from "blitz"

interface GetMilestonesInput
  extends Pick<Prisma.MilestoneFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include, skip = 0, take = 100 }: GetMilestonesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: milestones,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.milestone.count({ where }),
      query: (paginateArgs) => db.milestone.findMany({ ...paginateArgs, where, orderBy, include }),
    })

    return {
      milestones,
      nextPage,
      hasMore,
      count,
    }
  }
)
