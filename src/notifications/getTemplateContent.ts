import path from "path"
import fs from "fs"

export async function getTemplateContent(templateId: string): Promise<string> {
  const sourceDir = process.cwd()
  const folderPath = "src/messages/templates/"
  const fullPath = path.join(sourceDir, folderPath, `${templateId}.hbs`)
  try {
    const templateString = await fs.promises.readFile(fullPath, "utf8")

    return templateString
  } catch (error) {
    throw new Error(`Failed to load template content: ${error.message}`)
  }
}
