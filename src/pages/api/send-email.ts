//import { Mailer } from "../../../integrations/mailer" // for simple gmail type
// import { Amazon } from "../../../integrations/mailer" // for amazon ses
import { ResendMsg } from "../../../integrations/mailer" // for resend

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await ResendMsg(req.body)
      res.status(200).json({ message: "Email sent successfully" })
    } catch (error) {
      res.status(500).json({ error: "Failed to send email" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
