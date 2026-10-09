import { NotFoundError } from "blitz"
import db from "db"
import { getProjectAccess } from "./getProjectAccess"

// Server-side access checks for queries and mutations. The browser can't be trusted to ask
// only for what it may touch (hiding a button is not protection), so every endpoint that acts
// on a project's data calls one of these first. Anything the user may not reach is reported as
// "not found", so ids can't be probed for existence.

type SessionCtx = { session: { userId?: number | null } }

const deny = () => new NotFoundError()

const currentUserId = (ctx: SessionCtx): number => {
  const userId = ctx.session.userId
  if (!userId) throw deny()
  return userId
}

// The user being acted on must be the signed-in user (not someone the browser names)
export function requireSelf(ctx: SessionCtx, userId: number): void {
  if (currentUserId(ctx) !== userId) throw deny()
}

export async function requireProjectMember(ctx: SessionCtx, projectId: number): Promise<void> {
  const access = await getProjectAccess(currentUserId(ctx))
  if (!access.memberProjectIds.includes(projectId)) throw deny()
}

export async function requireProjectManager(ctx: SessionCtx, projectId: number): Promise<void> {
  const access = await getProjectAccess(currentUserId(ctx))
  if (!access.managerProjectIds.includes(projectId)) throw deny()
}

// A project manager, or the person themselves (e.g. setting up their own widgets)
export async function requireManagerOrSelf(
  ctx: SessionCtx,
  projectId: number,
  userId: number
): Promise<void> {
  const me = currentUserId(ctx)
  const access = await getProjectAccess(me)
  if (access.managerProjectIds.includes(projectId)) return
  if (me === userId && access.memberProjectIds.includes(projectId)) return
  throw deny()
}

// Things that live inside a project, and how to find the project of each
export type ProjectEntity =
  | "task"
  | "milestone"
  | "column"
  | "projectMember"
  | "taskLog"
  | "invitation"

const projectIdsOf = async (entity: ProjectEntity, ids: number[]): Promise<number[]> => {
  const where = { id: { in: ids } }
  switch (entity) {
    case "task":
      return (await db.task.findMany({ where, select: { projectId: true } })).map(
        (r) => r.projectId
      )
    case "milestone":
      return (await db.milestone.findMany({ where, select: { projectId: true } })).map(
        (r) => r.projectId
      )
    case "column":
      return (await db.kanbanBoard.findMany({ where, select: { projectId: true } })).map(
        (r) => r.projectId
      )
    case "projectMember":
      return (await db.projectMember.findMany({ where, select: { projectId: true } })).map(
        (r) => r.projectId
      )
    case "taskLog":
      return (
        await db.taskLog.findMany({ where, select: { task: { select: { projectId: true } } } })
      ).map((r) => r.task.projectId)
    case "invitation":
      return (await db.invitation.findMany({ where, select: { projectId: true } })).map(
        (r) => r.projectId
      )
  }
}

// Every id must exist; returns the (de-duplicated) projects they belong to
const resolveProjects = async (entity: ProjectEntity, ids: number[]): Promise<number[]> => {
  const unique = Array.from(new Set(ids))
  if (unique.length === 0) return []
  const found = await projectIdsOf(entity, unique)
  if (found.length !== unique.length) throw deny()
  return Array.from(new Set(found))
}

// The user manages the project of every one of these things. Returns those project ids.
export async function requireManagerOf(
  ctx: SessionCtx,
  entity: ProjectEntity,
  ids: number[]
): Promise<number[]> {
  const access = await getProjectAccess(currentUserId(ctx))
  const projectIds = await resolveProjects(entity, ids)
  if (projectIds.some((projectId) => !access.managerProjectIds.includes(projectId))) throw deny()
  return projectIds
}

// These things must all live in the given project (stops attaching another project's data)
export async function requireInProject(
  entity: ProjectEntity,
  ids: number[],
  projectId: number
): Promise<void> {
  const projectIds = await resolveProjects(entity, ids)
  if (projectIds.some((id) => id !== projectId)) throw deny()
}

// A project member row (a person, or a team) that the signed-in user is part of. Returns its
// project. Used where the browser names "who is doing this" and it has to be the caller.
export async function requireOwnMember(ctx: SessionCtx, projectMemberId: number): Promise<number> {
  const member = await db.projectMember.findFirst({
    where: { id: projectMemberId, users: { some: { id: currentUserId(ctx) } } },
    select: { projectId: true },
  })
  if (!member) throw deny()
  return member.projectId
}

// A task log is for its project's managers and for the people it is assigned to
export async function requireTaskLogParticipant(
  ctx: SessionCtx,
  taskLogId: number
): Promise<{ projectId: number; isManager: boolean }> {
  const userId = currentUserId(ctx)
  const access = await getProjectAccess(userId)
  const log = await db.taskLog.findUnique({
    where: { id: taskLogId },
    select: {
      task: { select: { projectId: true } },
      assignedTo: { select: { users: { select: { id: true } } } },
    },
  })
  if (!log) throw deny()
  const projectId = log.task.projectId
  const isManager = access.managerProjectIds.includes(projectId)
  const isAssignee = log.assignedTo.users.some((user) => user.id === userId)
  if (!isManager && !isAssignee) throw deny()
  return { projectId, isManager }
}

// An invitation can be accepted or declined by the person it is for (matched by email, as the
// invites list does), and managed by the managers of its project
export async function requireInviteAccess(
  ctx: SessionCtx,
  invitationId: number,
  options: { allowInvitee: boolean; allowManager: boolean }
): Promise<void> {
  const userId = currentUserId(ctx)
  const access = await getProjectAccess(userId)
  const invitation = await db.invitation.findUnique({
    where: { id: invitationId },
    select: { projectId: true, email: true },
  })
  if (!invitation) throw deny()
  if (options.allowManager && access.managerProjectIds.includes(invitation.projectId)) return
  if (options.allowInvitee) {
    const me = await db.user.findUnique({ where: { id: userId }, select: { email: true } })
    if (me && me.email.toLowerCase() === invitation.email.toLowerCase()) return
  }
  throw deny()
}

// Changing a member's role in a project: the caller manages the project, the member belongs to
// that project, and the user named is really one of that member's users
export async function requireManagerOfMemberUser(
  ctx: SessionCtx,
  projectMemberId: number,
  projectId: number,
  userId: number
): Promise<void> {
  const access = await getProjectAccess(currentUserId(ctx))
  if (!access.managerProjectIds.includes(projectId)) throw deny()
  const member = await db.projectMember.findFirst({
    where: { id: projectMemberId, projectId, users: { some: { id: userId } } },
    select: { id: true },
  })
  if (!member) throw deny()
}

// Forms, form versions and folders belong to a person, not a project
export async function requireFormOwner(ctx: SessionCtx, formIds: number[]): Promise<void> {
  const userId = currentUserId(ctx)
  const unique = Array.from(new Set(formIds))
  const forms = await db.form.findMany({
    where: { id: { in: unique } },
    select: { userId: true },
  })
  if (forms.length !== unique.length || forms.some((form) => form.userId !== userId)) throw deny()
}

export async function requireFormVersionOwner(
  ctx: SessionCtx,
  versionIds: number[]
): Promise<void> {
  const userId = currentUserId(ctx)
  const unique = Array.from(new Set(versionIds))
  const versions = await db.formVersion.findMany({
    where: { id: { in: unique } },
    select: { form: { select: { userId: true } } },
  })
  if (versions.length !== unique.length || versions.some((v) => v.form.userId !== userId)) {
    throw deny()
  }
}

export async function requireFolderOwner(ctx: SessionCtx, folderId: number): Promise<void> {
  const userId = currentUserId(ctx)
  const folder = await db.folder.findFirst({
    where: { id: folderId, userId },
    select: { id: true },
  })
  if (!folder) throw deny()
}

// A role belongs to the person who made it; a role tied to a project can also be managed by
// that project's managers
export async function requireRoleAccess(ctx: SessionCtx, roleIds: number[]): Promise<void> {
  const userId = currentUserId(ctx)
  const access = await getProjectAccess(userId)
  const unique = Array.from(new Set(roleIds))
  const roles = await db.role.findMany({
    where: { id: { in: unique } },
    select: { userId: true, projectId: true },
  })
  const allowed = (role: { userId: number; projectId: number | null }) =>
    role.userId === userId ||
    (role.projectId !== null && access.managerProjectIds.includes(role.projectId))
  if (roles.length !== unique.length || !roles.every(allowed)) throw deny()
}
