import db from "db"
import { getDefaultSchemaLists } from "src/forms/utils/getDefaultSchemaList"

export const createDefaultFormsForUsers = async () => {
  try {
    console.log("Fetching users...")
    const users = await db.user.findMany()
    console.log(`Found ${users.length} users.`)

    const formTemplateOptions = getDefaultSchemaLists().filter(
      (template) => template.label === "Project Information"
    )
    console.log("Form Template Options:", formTemplateOptions)

    if (!formTemplateOptions.length) {
      throw new Error("No form template found with label 'Project Information'")
    }

    const defaultTemplate = formTemplateOptions[0]

    for (const user of users) {
      console.log(`Creating form for user: ${user.email}`)
      const form = await db.form.create({
        data: {
          userId: user.id,
          versions: {
            create: {
              name: defaultTemplate?.label,
              version: 1,
              schema: defaultTemplate?.schema,
              uiSchema: defaultTemplate?.uiSchema,
            },
          },
        },
      })

      console.log(`Created form ID: ${form.id} for user: ${user.email}`)
    }
  } catch (error) {
    console.error("Error creating default forms:", error)
    throw error
  }
}
