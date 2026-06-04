import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { FormVersion } from "db"

export type FormVersionWithRelations = FormVersion & {
  archived?: boolean
  tasks: {
    id: number
    name: string
    project: { id: number; name: string }
  }[]
  projects: { id: number; name: string }[]
}

const GetFormSchema = z.object({
  id: z.number(),
  version: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(GetFormSchema),
  resolver.authorize(),
  async ({ id, version }) => {
    // Get the Form with the latest or a specific version
    const form = await db.form.findFirst({
      where: { id },
      include: {
        versions: {
          where: version ? { version } : {},
          orderBy: { version: "desc" },
          select: {
            id: true,
            name: true,
            formId: true,
            version: true,
            schema: true,
            uiSchema: true,
            archived: true,
            createdAt: true,
            tasks: {
              select: {
                id: true,
                name: true,
                project: { select: { id: true, name: true } },
              },
            },
            projects: { select: { id: true, name: true } },
          },
        },
        folder: { select: { id: true, name: true } },
        _count: { select: { versions: true } },
      },
    })

    if (!form) throw new NotFoundError()

    // Get the FormVersion
    const formVersion = form.versions[0]
    if (!formVersion) throw new NotFoundError("Form version not found")

    return {
      ...form,
      formVersion: formVersion,
      versions: form.versions as FormVersionWithRelations[],
    }
  }
)
