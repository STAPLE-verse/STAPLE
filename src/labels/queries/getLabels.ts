import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetLabelsInput
  extends Pick<Prisma.LabelFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100, include }: GetLabelsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: labels,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.label.count({ where }),
      query: (paginateArgs) =>
        db.label.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include,
        }),
    })

    return {
      labels,
      nextPage,
      hasMore,
      count,
    }
  }
)
