import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetFormDeploymentsSchema = z.object({
  formId: z.number(),
})

export type FormDeployment = {
  type: "task" | "project"
  id: number
  name: string
  projectName: string | null
  version: number
}

export default resolver.pipe(
  resolver.zod(GetFormDeploymentsSchema),
  resolver.authorize(),
  async ({ formId }) => {
    const versions = await db.formVersion.findMany({
      where: { formId },
      select: {
        version: true,
        tasks: {
          select: {
            id: true,
            name: true,
            project: { select: { id: true, name: true } },
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { version: "asc" },
    })

    const deployments: FormDeployment[] = versions.flatMap((v) => [
      ...v.tasks.map((t) => ({
        type: "task" as const,
        id: t.id,
        name: t.name,
        projectName: t.project.name,
        version: v.version,
      })),
      ...v.projects.map((p) => ({
        type: "project" as const,
        id: p.id,
        name: p.name,
        projectName: null,
        version: v.version,
      })),
    ])

    return deployments
  }
)
