import { Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"

// Return shape for the dashboard widget
type ProjectDashboardItem = {
  id: number
  name: string
  updatedAt: Date | null
  newCommentsCount: number
}

export default resolver.pipe(resolver.authorize(), async (_: unknown, ctx: Ctx) => {
  const userId = ctx.session.userId as number

  // 1) Projects for user + their projectMemberId per project (minimal select)
  const projects = await db.project.findMany({
    where: {
      projectMembers: { some: { users: { some: { id: userId } }, deleted: false } },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      projectMembers: {
        where: { users: { some: { id: userId } } },
        select: { id: true },
        take: 1,
      },
    },
  })

  if (projects.length === 0) {
    return { projects: [] as ProjectDashboardItem[] }
  }

  const projectIds = projects.map((p) => p.id)

  // 2) Fetch recent TaskLogs for these projects and reduce to latest per project
  //    (order and cap to avoid scanning excessive rows in huge workspaces)
  const recentLogs = await db.taskLog.findMany({
    where: { task: { projectId: { in: projectIds } } },
    select: { createdAt: true, task: { select: { projectId: true } } },
    orderBy: { createdAt: "desc" },
    take: 2000,
  })

  const latestByProject = new Map<number, Date>()
  for (const l of recentLogs) {
    const pid = l.task.projectId
    if (!latestByProject.has(pid)) latestByProject.set(pid, l.createdAt)
  }

  // If a project has no TaskLogs in the recentLogs window, there would be no latestByProject entry.
  // Fallback to the project's own createdAt so lastUpdate is never null.
  const decorated = projects.map((p: any) => ({
    id: p.id,
    name: p.name,
    myProjectMemberId: p.projectMembers[0]?.id as number | undefined,
    lastUpdate: (latestByProject.get(p.id) ?? p.createdAt) as Date,
  }))

  const top3 = decorated
    .sort((a, b) => (b.lastUpdate?.getTime() ?? 0) - (a.lastUpdate?.getTime() ?? 0))
    .slice(0, 3)

  // 4) For each project, compute unread = total comments in project - read:false for this pmId
  const results: ProjectDashboardItem[] = []
  for (const p of top3) {
    const pmId = p.myProjectMemberId
    let unread = 0
    if (pmId) {
      unread = await db.commentReadStatus.count({
        where: {
          projectMemberId: pmId,
          read: false,
          comment: { taskLog: { task: { projectId: p.id } } },
        },
      })
    }

    results.push({
      id: p.id,
      name: p.name,
      updatedAt: p.lastUpdate,
      newCommentsCount: unread,
    })
  }

  return { projects: results }
})
