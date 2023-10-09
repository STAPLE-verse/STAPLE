import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetColumnsInput
  extends Pick<Prisma.ColumnFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip, take, include }: GetColumnsInput) => {
    const query: Prisma.ColumnFindManyArgs = {
      where,
      orderBy,
      skip,
      take,
      include,
    }

    const columns = await db.column.findMany(query)

    return columns
  }
)
