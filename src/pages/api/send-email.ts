import { Mailer } from "../../../integrations/mailer"

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await Mailer(req.body)
      res.status(200).json({ message: "Email sent successfully" })
    } catch (error) {
      res.status(500).json({ error: "Failed to send email" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
