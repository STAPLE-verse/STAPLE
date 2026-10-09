import { resolver } from "@blitzjs/rpc"
import { RenameFolderSchema } from "src/forms/schemas"
import db from "db"

import { requireFolderOwner } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(RenameFolderSchema),
  resolver.authorize(),
  async ({ id, name }, ctx) => {
    await requireFolderOwner(ctx, id)
    return db.folder.update({ where: { id }, data: { name } })
  }
)
