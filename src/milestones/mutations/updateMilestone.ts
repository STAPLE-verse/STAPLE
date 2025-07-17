import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateMilestoneSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateMilestoneSchema),
  resolver.authorize(),
  async ({ id, taskIds, tags, ...rest }) => {
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
