import db from "db"
import { Ctx } from "@blitzjs/next"

export default async function migrateColumnsToMetadata(_: unknown, ctx: Ctx) {
  ctx.session.$authorize() // Authorize the user
  const projects = await db.project.findMany()

  for (const project of projects) {
    // Combine old columns into metadata
    const metadata = {
      abstract: project.abstract,
      keywords: project.keywords,
      citation: project.citation,
      publisher: project.publisher,
      identifier: project.identifier,
    }

    // Update the project to set the metadata column
    // leave other columns just in case
    await db.project.update({
      where: { id: project.id },
      data: {
        metadata,
      },
    })

    console.log(`Migrated columns to metadata for project ID: ${project.id}`)
  }
}
