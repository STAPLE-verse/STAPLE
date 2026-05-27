import { resolver } from "@blitzjs/rpc"
import { RenameFolderSchema } from "src/forms/schemas"
import db from "db"

export default resolver.pipe(
  resolver.zod(RenameFolderSchema),
  resolver.authorize(),
  async ({ id, name }) => {
    return db.folder.update({ where: { id }, data: { name } })
  }
)
