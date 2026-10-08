import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateProjectSchema } from "../schemas"

import { requireProjectManager } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(UpdateProjectSchema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    await requireProjectManager(ctx, id)
    const project = await db.project.update({
      where: { id },
      include: {
        formVersion: true, // Ensure formVersion is included
      },
      data,
    })

    return project
  }
)
