import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CopyMilestoneSchema } from "../schemas"
import { requireManagerOf } from "src/projectprivileges/utils/requireAccess"

// Makes a copy of a milestone in the same project: name (with " (Copy)"), description, tags and
// dates. Its tasks stay with the original, because a task can belong to only one milestone;
// they can be moved across afterwards with "Update Tasks".
export default resolver.pipe(
  resolver.zod(CopyMilestoneSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    await requireManagerOf(ctx, "milestone", [id])

    const original = await db.milestone.findUniqueOrThrow({ where: { id } })

    return db.milestone.create({
      data: {
        name: `${original.name} (Copy)`,
        description: original.description,
        projectId: original.projectId,
        tags: original.tags ?? undefined,
        startDate: original.startDate ?? undefined,
        endDate: original.endDate ?? undefined,
      },
    })
  }
)
