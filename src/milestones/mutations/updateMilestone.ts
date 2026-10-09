import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateMilestoneSchema } from "../schemas"

import { requireManagerOf, requireInProject } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(UpdateMilestoneSchema),
  resolver.authorize(),
  async ({ id, taskIds, tags, ...rest }, ctx) => {
    const [projectId] = await requireManagerOf(ctx, "milestone", [id])
    if (taskIds?.length) await requireInProject("task", taskIds, projectId!)
    const milestone = await db.milestone.update({
      where: { id },
      data: {
        ...rest,
        task: {
          set: taskIds?.map((id) => ({ id })) ?? [],
        },
        tags: tags ?? undefined,
      },
    })

    return milestone
  }
)
