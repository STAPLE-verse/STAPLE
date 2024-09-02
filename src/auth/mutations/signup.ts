import { SecurePassword } from "@blitzjs/auth/secure-password"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Role } from "types"
import { Signup } from "../schemas"
import { Mailer } from "integrations/mailer"

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
  }))

  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  await db.widget.createMany({
    data: widgets,
  })

  const msg = {
    from: "staple.helpdesk@gmail.com",
    to: email.toLowerCase().trim(),
    subject: "STAPLE Account Created",
    html: `
      <h3>Welcome to STAPLE</h3>

      You requested a STAPLE account at https://app.staple.science.
      You may now log in to your account.
      <p>
      If you need more help or did not request an account,
      you can reply to this email to create a ticket.
      <p>
      Thanks,
      <br>
      STAPLE HelpDesk
    `,
  }

  Mailer(msg)

  return user
})
