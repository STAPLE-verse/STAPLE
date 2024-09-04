import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const removeProjectManagerWidgetsProps = z.object({
  userId: z.number(),
  projectId: z.number(),
})

export default resolver.pipe(
  resolver.zod(removeProjectManagerWidgetsProps),
  resolver.authorize(),
  async ({ userId, projectId }) => {
    await db.projectWidget.deleteMany({
      where: {
        userId,
        projectId,
        privilege: {
          has: "PROJECT_MANAGER",
        },
      },
    })
  }
)
