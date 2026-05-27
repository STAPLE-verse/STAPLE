import { resolver } from "@blitzjs/rpc"
import { CreateFolderSchema } from "src/forms/schemas"
import db from "db"

export default resolver.pipe(
  resolver.zod(CreateFolderSchema),
  resolver.authorize(),
  async ({ name }, ctx) => {
    return db.folder.create({
      data: { name, userId: ctx.session.userId },
    })
  }
)
