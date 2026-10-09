import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

import { requireFormVersionOwner } from "src/projectprivileges/utils/requireAccess"
const UpdateFormVersionArchiveSchema = z.object({
  id: z.number(),
  archived: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(UpdateFormVersionArchiveSchema),
  resolver.authorize(),
  async ({ id, archived }, ctx) => {
    await requireFormVersionOwner(ctx, [id])
    const version = await db.formVersion.update({
      where: { id },
      data: { archived },
    })

    return version
  }
)
