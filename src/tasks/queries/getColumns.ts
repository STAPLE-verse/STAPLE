import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

import { scopeReadQuery, inMyProjects } from "src/projectprivileges/utils/scopeReadQuery"
interface GetKanbanBoardInput
  extends Pick<Prisma.KanbanBoardFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  scopeReadQuery(
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
    },
    (access) => inMyProjects(access)
  )
)
