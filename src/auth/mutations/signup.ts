import { SecurePassword } from "@blitzjs/auth/secure-password"
import { resolver } from "@blitzjs/rpc"
import db, { WidgetSize } from "db"
import { Role } from "types"
import { Signup } from "../schemas"
// import { Mailer } from "integrations/mailer"
// import { Amazon } from "integrations/mailer"
import { ResendMsg } from "integrations/mailer"
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

  // Existing large widgets
  const widgetTypes = ["LastProject", "OverdueTask", "UpcomingTask", "Notifications"]

  const widgets = widgetTypes.map((type, index) => ({
    userId: user.id,
    type: type,
    show: true,
    position: index + 1,
    size: WidgetSize.LARGE,
  }))

  // New small widgets
  const smallWidgetTypes = [
    "AllTaskTotal",
    "TotalContributors",
    "TotalForms",
    "TotalInvites",
    "TotalProjects",
    "TotalRoles",
  ]

  const smallWidgets = smallWidgetTypes.map((type, index) => ({
    userId: user.id,
    type: type,
    show: true,
    position: widgetTypes.length + index + 1,
    size: WidgetSize.SMALL,
  }))

  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  await db.widget.createMany({
    data: [...widgets, ...smallWidgets],
  })

  await ResendMsg(createSignUpMsg(email))

  return user
})
