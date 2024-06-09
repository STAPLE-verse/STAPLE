import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { paginate } from "blitz"

interface GetElementsInput
  extends Pick<Prisma.ElementFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include, skip = 0, take = 100 }: GetElementsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: elements,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.element.count({ where }),
      query: (paginateArgs) => db.element.findMany({ ...paginateArgs, where, orderBy, include }),
    })

    return {
      elements,
      nextPage,
      hasMore,
      count,
    }
  }
)
