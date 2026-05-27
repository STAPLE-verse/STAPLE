import { resolver } from "@blitzjs/rpc"
import { DeleteFolderSchema } from "src/forms/schemas"
import db from "db"

export default resolver.pipe(
  resolver.zod(DeleteFolderSchema),
  resolver.authorize(),
  async ({ id }) => {
    // Unassign all forms in this folder before deleting
    await db.form.updateMany({
      where: { folderId: id },
      data: { folderId: null },
    })
    return db.folder.delete({ where: { id } })
  }
)
