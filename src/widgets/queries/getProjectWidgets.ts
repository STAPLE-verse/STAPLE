import db, { ProjectWidget } from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

const GetProjectWidgets = z.object({
  userId: z.number(),
  projectId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetProjectWidgets),
  resolver.authorize(),
  async ({ userId, projectId }) => {
    if (!userId) {
      throw new Error("User ID is required")
    }

    if (!projectId) {
      throw new Error("Project ID is required")
    }

    const widgets = await db.projectWidget.findMany({
      where: {
        userId: userId,
        show: true,
        projectId: projectId,
      },
      orderBy: { position: "asc" },
    })

    return widgets as ProjectWidget[]
  }
)
