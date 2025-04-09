import { Ctx } from "blitz"
import initializeWidgets from "src/widgets/mutations/initializeWidgets"
import db from "db"

export default async function migrateNewDashboardWidgets(_: unknown, ctx: Ctx) {
  ctx.session.$authorize() // Authorize the user

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
    await initializeWidgets(user.id, ctx)
  }

  console.log("Widgets migration completed for all users.")
}
