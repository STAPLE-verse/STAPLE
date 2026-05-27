import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_input, ctx) => {
  return db.folder.findMany({
    where: { userId: ctx.session.userId },
    orderBy: { name: "asc" },
    include: { _count: { select: { forms: true } } },
  })
})
