import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateMilestoneDatesSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateMilestoneDatesSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const milestone = await db.milestone.update({
      where: { id },
      data,
    })

    return milestone
  }
)
