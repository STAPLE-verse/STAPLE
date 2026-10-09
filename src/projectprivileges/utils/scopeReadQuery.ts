import { getProjectAccess, ProjectAccess } from "./getProjectAccess"
import { hideOthersResponses } from "./hideOthersResponses"

type SessionCtx = { session: { userId?: number | null } }

// Puts the caller's own limit next to the filter the browser sent, so it can only narrow it
export const andWhere = (requested: unknown, limit: unknown): any =>
  requested ? { AND: [requested, limit] } : limit

// Wraps a read query that takes a filter (`where`) from the browser. The browser's filter is
// always combined with `buildScope` (what this person may see), and form responses and task chat
// belonging to other people are blanked in whatever the query returns, however it was included.
export function scopeReadQuery<I extends { where?: any }, O>(
  query: (input: I) => Promise<O>,
  buildScope: (access: ProjectAccess, userId: number) => unknown | Promise<unknown>
) {
  return async (input: I, ctx: SessionCtx): Promise<O> => {
    const userId = ctx.session.userId as number
    const access = await getProjectAccess(userId)
    const scope = await buildScope(access, userId)
    const result = await query({ ...input, where: andWhere(input?.where, scope) })
    return hideOthersResponses(result, userId, access)
  }
}

// What a person may see of things that live in a project: only their own projects
export const inMyProjects = (access: ProjectAccess, field = "projectId") => ({
  [field]: { in: access.memberProjectIds },
})
