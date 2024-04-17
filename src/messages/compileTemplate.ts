import handlebars from "handlebars"
import { getTemplateContent } from "./getTemplateContent"

export enum TemplateType {
  Email = "email",
  Notification = "notification",
}

export async function compileTemplate(
  templateId: string,
  data: any,
  type: TemplateType
): Promise<string> {
  try {
    // Await the promise to get the actual template string
    const templateString = await getTemplateContent(templateId, type)
    const template = handlebars.compile(templateString)
    const message = template(data)
    return message
  } catch (error) {
    console.error("Error compiling template:", error)
    throw error // Re-throw to handle the error elsewhere or to indicate failure
  }
}
