import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetElementsInput
  extends Pick<Prisma.ElementFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip, take, include }: GetElementsInput) => {
    const query: Prisma.ElementFindManyArgs = {
      where,
      orderBy,
      skip,
      take,
      include,
    }

    const elements = await db.element.findMany(query)

    return elements
  }
)
