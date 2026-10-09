import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateMilestoneSchema } from "../schemas"

import { requireProjectManager, requireInProject } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(CreateMilestoneSchema),
  resolver.authorize(),
  async ({ projectId, name, description, taskIds, startDate, endDate, tags }, ctx) => {
    await requireProjectManager(ctx, projectId)
    if (taskIds?.length) await requireInProject("task", taskIds, projectId)
    const milestone = await db.milestone.create({
      data: {
        name,
        description,
        startDate,
        endDate,
        tags: tags ? tags : [],
        project: {
          connect: { id: projectId },
        },
        task: taskIds?.length
          ? {
              connect: taskIds.map((id) => ({ id })),
            }
          : undefined,
      },
    })

    return milestone
  }
)
