import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Ctx, NotFoundError } from "blitz"
import { UpdateUserSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateUserSchema),
  resolver.authorize(),
  async ({ email, firstName, lastName }, ctx: Ctx) => {
    const user = await db.user.findFirst({ where: { id: ctx.session.userId! } })

    if (!user) throw new NotFoundError()

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { email: email, firstName: firstName, lastName: lastName },
    })

    return updatedUser
  }
)
