import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetKanbanBoardInput
  extends Pick<Prisma.KanbanBoardFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip, take, include }: GetKanbanBoardInput) => {
    const query: Prisma.KanbanBoardFindManyArgs = {
      where,
      orderBy,
      skip,
      take,
      include,
    }

    const columns = await db.kanbanBoard.findMany(query)

    return columns
  }
)
