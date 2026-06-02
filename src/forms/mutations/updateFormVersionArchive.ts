import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateFormVersionArchiveSchema = z.object({
  id: z.number(),
  archived: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(UpdateFormVersionArchiveSchema),
  resolver.authorize(),
  async ({ id, archived }) => {
    const version = await db.formVersion.update({
      where: { id },
      data: { archived },
    })

    return version
  }
)
