import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetElementsInput
  extends Pick<Prisma.ElementFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(resolver.authorize(), async ({ where, orderBy }: GetElementsInput) => {
  const elements = await db.element.findMany({
    where,
    orderBy,
  })

  return elements
})
