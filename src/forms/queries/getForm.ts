import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetFormSchema = z.object({
  id: z.number(),
  version: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(GetFormSchema),
  resolver.authorize(),
  async ({ id, version }) => {
    // Get the Form with the latest or a specific version
    const form = await db.forms.findFirst({
      where: { id },
      include: {
        versions: {
          where: version ? { version } : {},
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    })

    if (!form) throw new NotFoundError()

    // Get the FormVersion
    const formVersion = form.versions[0]
    if (!formVersion) throw new NotFoundError("Form version not found")

    return {
      ...form,
      formVersion: formVersion,
    }
  }
)
