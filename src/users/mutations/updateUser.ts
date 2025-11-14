import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Ctx, NotFoundError } from "blitz"
import { UpdateUserSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateUserSchema),
  resolver.authorize(),
  async (
    {
      email,
      firstName,
      lastName,
      institution,
      username,
      language,
      gravatar,
      tooltips,
      emailProjectActivityFrequency,
      emailOverdueTaskFrequency,
    },
    ctx: Ctx
  ) => {
    const user = await db.user.findFirst({ where: { id: ctx.session.userId! } })

    if (!user) throw new NotFoundError()

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        institution: institution,
        username: username,
        language: language,
        gravatar: gravatar,
        tooltips: tooltips,
        emailProjectActivityFrequency: emailProjectActivityFrequency,
        emailOverdueTaskFrequency: emailOverdueTaskFrequency,
      },
    })

    // Sync session with updated tooltip setting
    await ctx.session.$setPublicData({
      tooltips: updatedUser.tooltips,
    })

    return updatedUser
  }
)
