import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"
import { ResendMsg } from "integrations/mailer"
import { createFeedbackMsg } from "integrations/emails"

const SendFeedbackInput = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
})

export default resolver.pipe(
  resolver.zod(SendFeedbackInput),
  resolver.authorize(),
  async ({ subject, message }, ctx) => {
    const user = await db.user.findFirst({
      where: { id: ctx.session.userId! },
      select: { username: true, email: true },
    })

    await ResendMsg(
      createFeedbackMsg({
        fromUsername: user?.username ?? "Unknown",
        fromEmail: user?.email ?? "Unknown",
        subject,
        message,
      })
    )

    return { success: true }
  }
)
