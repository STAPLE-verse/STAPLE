import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { THEME_VALUES } from "src/core/utils/themes"

const UpdateThemeSchema = z.object({
  theme: z.enum(THEME_VALUES),
})

// Saves the signed-in user's theme to their account (the same column MARKER reads)
export default resolver.pipe(
  resolver.zod(UpdateThemeSchema),
  resolver.authorize(),
  async ({ theme }, ctx) => {
    const updated = await db.user.update({
      where: { id: ctx.session.userId! },
      data: { theme },
      select: { theme: true },
    })

    // keep the session in step so the theme applies on every page without another query
    await ctx.session.$setPublicData({ theme: updated.theme })

    return updated
  }
)
