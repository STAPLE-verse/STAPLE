import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetColumnsInput
  extends Pick<Prisma.ColumnFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(resolver.authorize(), async ({ where, orderBy }: GetColumnsInput) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const columns = await db.column.findMany({
    where,
    orderBy,
  })

  return columns
})
