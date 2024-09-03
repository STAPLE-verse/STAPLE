import { SecurePassword } from "@blitzjs/auth/secure-password"
import { resolver } from "@blitzjs/rpc"
import db, { WidgetSize } from "db"
import { Role } from "types"
import { Signup } from "../schemas"
// import { Mailer } from "integrations/mailer"
import { Amazon } from "integrations/mailer"
import { createSignUpMsg } from "integrations/emails"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password, username }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())

  const user = await db.user.create({
    data: {
      email: email.toLowerCase().trim(),
      hashedPassword,
      role: "USER",
      username: username,
      tos: true,
    },
    select: { id: true, email: true, role: true, username: true, tos: true },
  })

  // Adding main dashboard default widgets
  const widgetTypes = ["LastProject", "OverdueTask", "UpcomingTask", "Notifications"]

  const widgets = widgetTypes.map((type, index) => ({
    userId: user.id,
    type: type,
    show: true,
    position: index + 1,
    size: WidgetSize.LARGE,
  }))

  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  await db.widget.createMany({
    data: widgets,
  })

  await Amazon(createSignUpMsg(email))

  return user
})
