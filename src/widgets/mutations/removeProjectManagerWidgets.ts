import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

import { requireProjectManager } from "src/projectprivileges/utils/requireAccess"
const removeProjectManagerWidgetsProps = z.object({
  userId: z.number(),
  projectId: z.number(),
})

export default resolver.pipe(
  resolver.zod(removeProjectManagerWidgetsProps),
  resolver.authorize(),
  async ({ userId, projectId }, ctx) => {
    await requireProjectManager(ctx, projectId)
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
