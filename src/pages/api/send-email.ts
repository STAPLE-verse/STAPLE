//import { Mailer } from "../../../integrations/mailer" // for simple gmail type
// import { Amazon } from "../../../integrations/mailer" // for amazon ses
import { ResendMsg } from "../../../integrations/mailer" // for resend
import { api } from "src/blitz-server"
import { mayEmail } from "src/core/utils/emailAccess"

export default api(async (req, res, ctx) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const userId = ctx.session.userId
  if (!userId) {
    return res.status(401).json({ error: "Sign in required" })
  }
  if (!(await mayEmail(userId, req.body))) {
    return res.status(403).json({ error: "This message can't be sent" })
  }

  try {
    await ResendMsg(req.body)
    res.status(200).json({ message: "Email sent successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" })
  }
})
