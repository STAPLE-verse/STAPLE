import db from "db"
import { resolver } from "@blitzjs/rpc"

export default resolver.pipe(
  resolver.authorize(),
  async ({ userId, projectId }: { userId: number; projectId: number }) => {
    if (!userId) {
      throw new Error("User ID is required")
    }

    if (!projectId) {
      throw new Error("Project ID is required")
    }

    try {
      const widgets = await db.projectwidget.findMany({
        where: {
          userId,
          show: true,
          projectId: projectId,
        },
        orderBy: { position: "asc" },
      })
      return widgets
    } catch (error) {
      console.error("Failed to fetch widgets:", error)
      throw error
    }
  }
)
