import { Ctx } from "blitz"
import db from "db"

export default async function migrateElementsToMilestones(_: unknown, ctx: Ctx) {
  ctx.session.$authorize() // Authorize the user

  const elements = await db.element.findMany()

  for (const element of elements) {
    const existing = await db.milestone.findUnique({ where: { id: element.id } })
    if (existing) {
      console.warn(`Milestone with id ${element.id} already exists. Skipping.`)
      continue
    }
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

  const updatedWidgets = await db.projectWidget.updateMany({
    where: {
      type: "ElementSummary",
    },
    data: {
      type: "MilestoneSummary",
    },
  })

  console.log(
    `Updated ${updatedWidgets.count} project widgets from ElementSummary to MilestoneSummary`
  )
}
