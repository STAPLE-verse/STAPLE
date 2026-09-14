import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { EditFormSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(EditFormSchema),
  resolver.authorize(),
  async ({ id, schema, uiSchema, semantics }) => {
    const newSchema = schema != null ? schema : Prisma.JsonNull
    const newUi = uiSchema != null ? uiSchema : Prisma.JsonNull
    // `undefined` (field omitted) means "caller doesn't know about semantics,
    // leave it alone"; explicit `null` means "user removed the component."
    const semanticsProvided = semantics !== undefined
    const newSemantics = (semantics ?? Prisma.JsonNull) as Prisma.NullableJsonNullValueInput
    const schemaName =
      typeof schema === "object" &&
      schema !== null &&
      "title" in schema &&
      typeof schema.title === "string"
        ? schema.title
        : "No Title"

    const currentForm = await db.form.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
          select: {
            id: true,
            version: true,
            semantics: true,
            tasks: { select: { id: true } },
            projects: { select: { id: true } },
          },
        },
      },
    })

    if (!currentForm) {
      throw new Error("Form not found")
    }

    const latestVersion = currentForm.versions[0]
    const isInUse =
      (latestVersion?.tasks?.length ?? 0) > 0 || (latestVersion?.projects?.length ?? 0) > 0

    if (latestVersion && !isInUse) {
      // Edit in place — no new version needed
      return db.formVersion.update({
        where: { id: latestVersion.id },
        data: {
          schema: newSchema,
          uiSchema: newUi || Prisma.JsonNull,
          name: schemaName,
          ...(semanticsProvided ? { semantics: newSemantics } : {}),
        },
      })
    }

    // Version is deployed — create a new version to preserve existing data
    return db.formVersion.create({
      data: {
        formId: id,
        version: (latestVersion?.version ?? 0) + 1,
        schema: newSchema,
        uiSchema: newUi || Prisma.JsonNull,
        semantics: semanticsProvided ? newSemantics : latestVersion?.semantics ?? Prisma.JsonNull,
        name: schemaName,
      },
    })
  }
)
