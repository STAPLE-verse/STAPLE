import { Ctx } from "blitz"
import { createDefaultWidgets } from "src/widgets/utils/createDefaultWidgets"
import db from "db"

export default async function migrateNewDashboardWidgets(_: unknown, ctx: Ctx) {
  ctx.session.$authorize("ADMIN") // one-off maintenance: administrators only

  // Get all users
  const users = await db.user.findMany({
    select: { id: true },
  })

  for (const user of users) {
    console.log(`Deleting old widgets for user: ${user.id}`)

    // Delete existing widgets before re-initializing
    await db.widget.deleteMany({
      where: { userId: user.id },
    })

    console.log(`Initializing new widgets for user: ${user.id}`)
    await createDefaultWidgets(user.id)
  }

  console.log("Widgets migration completed for all users.")
}
