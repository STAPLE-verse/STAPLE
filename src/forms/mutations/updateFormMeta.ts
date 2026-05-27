import { resolver } from "@blitzjs/rpc"
import { UpdateFormMetaSchema } from "../schemas"
import db from "db"

export default resolver.pipe(
  resolver.zod(UpdateFormMetaSchema),
  resolver.authorize(),
  async ({ id, tags, folderId }) => {
    const data: Record<string, unknown> = {}
    if (tags !== undefined) data.tags = tags
    if (folderId !== undefined) data.folderId = folderId

    return db.form.update({
      where: { id },
      data,
      include: { folder: { select: { id: true, name: true } } },
    })
  }
)
