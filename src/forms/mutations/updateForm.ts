import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { EditFormSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(EditFormSchema),
  resolver.authorize(),
  async ({ id, schema, uiSchema }) => {
    const newSchema = schema != null ? schema : Prisma.JsonNull
    const newUi = uiSchema != null ? uiSchema : Prisma.JsonNull
    const schemaName =
      typeof schema === "object" &&
      schema !== null &&
      "title" in schema &&
      typeof schema.title === "string"
        ? schema.title
        : "No Title"

    // Fetch the current form to get the current version number
    const currentForm = await db.form.findUnique({
      where: { id },
      include: { versions: { orderBy: { version: "desc" }, take: 1 } },
    })

    if (!currentForm) {
      throw new Error("Form not found")
    }

    const currentVersion = currentForm.versions[0]?.version || 0
    const newVersion = currentVersion + 1

    // Create a new form version
    const updatedForm = await db.formVersion.create({
      data: {
        formId: id,
        version: newVersion,
        schema: newSchema,
        uiSchema: newUi || Prisma.JsonNull,
        name: schemaName,
      },
    })

    return updatedForm
  }
)
