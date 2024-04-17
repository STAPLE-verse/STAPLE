import fs from "fs"
import path from "path"

export default async function handler(req, res) {
  const { templateId, type } = req.query

  const sourceDir = process.cwd()
  const folderPath =
    type === "email" ? "src/messages/templates/emails" : "src/messages/templates/notifications"
  const fullPath = path.join(sourceDir, folderPath, `${templateId}.hbs`)

  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: "Template file not found" })
  }

  try {
    const templateString = await fs.promises.readFile(fullPath, "utf8")
    res.status(200).json({ content: templateString })
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(404).json({ error: "Template file not found" })
    } else {
      res.status(500).json({ error: `Failed to read template: ${error.message}` })
    }
  }
}
