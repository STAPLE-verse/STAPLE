import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetRolesInput
  extends Pick<Prisma.RoleFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100, include }: GetRolesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: roles,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.role.count({ where }),
      query: (paginateArgs) =>
        db.role.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include,
        }),
    })

    return {
      roles,
      nextPage,
      hasMore,
      count,
    }
  }
)
