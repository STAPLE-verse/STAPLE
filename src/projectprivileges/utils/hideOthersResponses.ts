import db from "db"
import type { ProjectAccess } from "./getProjectAccess"

// Form responses (`metadata`) and the chat on a task log are only for the people they concern:
// the project's managers, and whoever the log is assigned to (including their teams). Queries
// that let the browser choose what to include can pull task logs in from many places (a task's
// logs, a member's logs, a milestone's tasks' logs...), so this walks the result and blanks the
// response and chat on any log the caller may not read. Everything else about the log (status,
// approval, dates) stays, so counts and summaries keep working.

type TaskLogLike = { id: number; taskId: number; assignedToId: number }

const isTaskLog = (value: unknown): value is TaskLogLike => {
  const v = value as Record<string, unknown> | null
  return (
    !!v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    typeof v.id === "number" &&
    typeof v.taskId === "number" &&
    typeof v.assignedToId === "number"
  )
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)

const collectLogIds = (value: unknown, ids: Set<number>, isLog: (node: unknown) => boolean) => {
  if (Array.isArray(value)) value.forEach((item) => collectLogIds(item, ids, isLog))
  else if (isPlainObject(value)) {
    if (isLog(value)) ids.add(value.id as number)
    Object.values(value).forEach((child) => collectLogIds(child, ids, isLog))
  }
}

export async function hideOthersResponses<T>(
  value: T,
  userId: number,
  access: ProjectAccess,
  // For a query that returns task logs themselves: every item at the top is a log
  options: { rootAreLogs?: boolean } = {}
): Promise<T> {
  const roots = new Set<unknown>(options.rootAreLogs && Array.isArray(value) ? value : [])
  const isLog = (node: unknown) => isTaskLog(node) || roots.has(node)
  const ids = new Set<number>()
  collectLogIds(value, ids, isLog)
  if (ids.size === 0) return value

  const owners = await db.taskLog.findMany({
    where: { id: { in: Array.from(ids) } },
    select: {
      id: true,
      task: { select: { projectId: true } },
      assignedTo: { select: { users: { select: { id: true } } } },
    },
  })
  const mayRead = new Set(
    owners
      .filter(
        (log) =>
          access.managerProjectIds.includes(log.task.projectId) ||
          log.assignedTo.users.some((user) => user.id === userId)
      )
      .map((log) => log.id)
  )

  const rewrite = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(rewrite)
    if (!isPlainObject(node)) return node
    const copy: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(node)) copy[key] = rewrite(child)
    if (isLog(node) && !mayRead.has(node.id as number)) {
      if ("metadata" in copy) copy.metadata = null
      if ("comments" in copy) copy.comments = []
    }
    return copy
  }
  return rewrite(value) as T
}
