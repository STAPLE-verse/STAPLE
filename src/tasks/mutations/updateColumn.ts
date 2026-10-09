import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateColumnSchema } from "../schemas"

import { requireManagerOf } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(UpdateColumnSchema),
  resolver.authorize(),
  async ({ id, name }, ctx) => {
    await requireManagerOf(ctx, "column", [id])
    const updated = await db.kanbanBoard.update({
      where: { id: id },
      data: { name },
    })
    return updated
  }
)
