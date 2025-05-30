import { Ctx } from "blitz"
import db from "db"

export default async function migrateElementsToMilestones(_: unknown, ctx: Ctx) {
  ctx.session.$authorize() // Authorize the user

  const elements = await db.element.findMany()

  for (const element of elements) {
    await db.milestone.create({
      data: {
        id: element.id,
        createdAt: element.createdAt,
        updatedAt: element.updatedAt,
        projectId: element.projectId,
        name: element.name,
        description: element.description,
      },
    })
    console.log(`Migrated element ${element.id} to milestone`)
  }

  console.log("Migration of elements to milestones completed.")
}
