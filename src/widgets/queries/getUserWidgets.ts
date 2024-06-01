import db from "db"
import { resolver } from "@blitzjs/rpc"

export default resolver.pipe(resolver.authorize(), async ({ userId }: { userId: number }) => {
  if (!userId) {
    throw new Error("User ID is required")
  }
  try {
    const widgets = await db.widget.findMany({
      where: { userId, show: true },
      orderBy: { position: "asc" },
    })
    return widgets
  } catch (error) {
    console.error("Failed to fetch widgets:", error)
    throw error
  }
})
