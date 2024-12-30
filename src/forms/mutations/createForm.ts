import { resolver } from "@blitzjs/rpc"
import { CreateFormSchema } from "../schemas"
import db, { Prisma } from "db"

export default resolver.pipe(
  resolver.zod(CreateFormSchema),
  resolver.authorize(),
  async ({ userId, schema, uiSchema }) => {
    const newSchema = schema != null ? schema : Prisma.JsonNull
    // Safely extracting the title/name of the schema from the schema
    const schemaName =
      typeof schema === "object" &&
      schema !== null &&
      "title" in schema &&
      typeof schema.title === "string"
        ? schema.title
        : "No Title"

    // Create Form entry
    const form = await db.form.create({
      data: {
        userId,
        versions: {
          // Create FormVersion entry
          create: {
            version: 1,
            schema: newSchema,
            uiSchema: uiSchema || Prisma.JsonNull,
            name: schemaName,
          },
        },
      },
      include: {
        versions: true, // Include related formVersion in the return
      },
    })

    return form
  }
)
