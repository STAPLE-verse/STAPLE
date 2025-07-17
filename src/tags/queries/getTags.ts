import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

type SourceType = "task" | "milestone" | "projectMember" | "all"

interface GetTagsInput {
  source?: SourceType
  where?: Prisma.TaskWhereInput | Prisma.MilestoneWhereInput | Prisma.ProjectMemberWhereInput
}

export default resolver.pipe(resolver.authorize(), async ({ source, where }: GetTagsInput) => {
  const results: any[] = []

  if (!source || source === "all" || source === "task") {
    const tasks = await db.task.findMany({
      where: {
        AND: [
          { tags: { not: Prisma.JsonNull } },
          ...(where ? [where as Prisma.TaskWhereInput] : []),
        ],
      },
    })
    results.push(...tasks.map((t) => t.tags).flat())
  }

  if (!source || source === "all" || source === "milestone") {
    const milestones = await db.milestone.findMany({
      where: {
        AND: [
          { tags: { not: Prisma.JsonNull } },
          ...(where ? [where as Prisma.MilestoneWhereInput] : []),
        ],
      },
    })
    results.push(...milestones.map((m) => m.tags).flat())
  }

  if (!source || source === "all" || source === "projectMember") {
    const members = await db.projectMember.findMany({
      where: {
        AND: [
          { tags: { not: Prisma.JsonNull } },
          ...(where ? [where as Prisma.ProjectMemberWhereInput] : []),
        ],
      },
    })
    results.push(...members.map((p) => p.tags).flat())
  }

  return results.filter(Boolean)
})
