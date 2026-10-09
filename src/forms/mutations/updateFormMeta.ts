import { resolver } from "@blitzjs/rpc"
import { UpdateFormMetaSchema } from "../schemas"
import db from "db"

import { requireFormOwner, requireFolderOwner } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(UpdateFormMetaSchema),
  resolver.authorize(),
  async ({ id, tags, folderId }, ctx) => {
    await requireFormOwner(ctx, [id])
    if (folderId) await requireFolderOwner(ctx, folderId)
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
