import { beforeEach, describe, expect, test, vi } from "vitest"

// vi.mock is hoisted above these, so the mock reaches them lazily at call time
const privileges = vi.fn()
const db = {
  task: { findMany: vi.fn() },
  milestone: { findMany: vi.fn() },
  projectMember: { findMany: vi.fn(), findFirst: vi.fn() },
  taskLog: { findMany: vi.fn(), findUnique: vi.fn() },
  invitation: { findUnique: vi.fn() },
  user: { findUnique: vi.fn() },
  form: { findMany: vi.fn() },
  formVersion: { findMany: vi.fn() },
  folder: { findFirst: vi.fn() },
  role: { findMany: vi.fn() },
}
vi.mock("db", () => ({
  default: new Proxy(
    {},
    {
      get: (_t, model: string) =>
        model === "projectPrivilege"
          ? { findMany: (...a: unknown[]) => privileges(...a) }
          : new Proxy(
              {},
              {
                get:
                  (_m, method: string) =>
                  (...a: unknown[]) =>
                    (db as any)[model][method](...a),
              }
            ),
    }
  ),
  MemberPrivileges: { PROJECT_MANAGER: "PROJECT_MANAGER", CONTRIBUTOR: "CONTRIBUTOR" },
}))

import {
  requireFolderOwner,
  requireFormOwner,
  requireFormVersionOwner,
  requireInProject,
  requireInviteAccess,
  requireManagerOf,
  requireManagerOfMemberUser,
  requireManagerOrSelf,
  requireOwnMember,
  requireProjectManager,
  requireProjectMember,
  requireRoleAccess,
  requireSelf,
  requireTaskLogParticipant,
} from "./requireAccess"

const ME = 7
const ctx: any = { session: { userId: ME } }
const signedOut: any = { session: { userId: null } }
// I manage project 1 and am a contributor in project 2; project 3 is not mine
const MINE = [
  { projectId: 1, privilege: "PROJECT_MANAGER" },
  { projectId: 2, privilege: "CONTRIBUTOR" },
]

describe("requireAccess", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    privileges.mockResolvedValue(MINE)
  })

  test("everything refuses when nobody is signed in", async () => {
    await expect(requireProjectManager(signedOut, 1)).rejects.toThrow()
    expect(() => requireSelf(signedOut, ME)).toThrow()
  })

  test("project membership and management", async () => {
    await expect(requireProjectManager(ctx, 1)).resolves.toBeUndefined()
    await expect(requireProjectManager(ctx, 2)).rejects.toThrow() // contributor only
    await expect(requireProjectManager(ctx, 3)).rejects.toThrow()
    await expect(requireProjectMember(ctx, 2)).resolves.toBeUndefined()
    await expect(requireProjectMember(ctx, 3)).rejects.toThrow()
  })

  test("requireSelf only accepts the signed-in user's own id", () => {
    expect(() => requireSelf(ctx, ME)).not.toThrow()
    expect(() => requireSelf(ctx, 8)).toThrow()
  })

  test("a project manager, or the person themselves once they're in the project", async () => {
    await expect(requireManagerOrSelf(ctx, 1, 99)).resolves.toBeUndefined() // I manage it
    await expect(requireManagerOrSelf(ctx, 2, ME)).resolves.toBeUndefined() // my own, I'm a member
    await expect(requireManagerOrSelf(ctx, 2, 99)).rejects.toThrow() // someone else's, not a manager
    await expect(requireManagerOrSelf(ctx, 3, ME)).rejects.toThrow() // not in the project
  })

  test("requireManagerOf needs every id to exist and sit in a project I manage", async () => {
    db.task.findMany.mockResolvedValue([{ projectId: 1 }, { projectId: 1 }])
    await expect(requireManagerOf(ctx, "task", [10, 11])).resolves.toEqual([1])

    db.task.findMany.mockResolvedValue([{ projectId: 1 }, { projectId: 3 }])
    await expect(requireManagerOf(ctx, "task", [10, 11])).rejects.toThrow() // one is elsewhere

    db.task.findMany.mockResolvedValue([{ projectId: 1 }])
    await expect(requireManagerOf(ctx, "task", [10, 11])).rejects.toThrow() // one doesn't exist

    db.task.findMany.mockResolvedValue([{ projectId: 2 }])
    await expect(requireManagerOf(ctx, "task", [10])).rejects.toThrow() // I'm only a contributor there
  })

  test("requireInProject stops attaching another project's things", async () => {
    db.projectMember.findMany.mockResolvedValue([{ projectId: 1 }])
    await expect(requireInProject("projectMember", [5], 1)).resolves.toBeUndefined()
    await expect(requireInProject("projectMember", [5], 2)).rejects.toThrow()
  })

  test("a member row must really be mine", async () => {
    db.projectMember.findFirst.mockResolvedValue({ projectId: 2 })
    await expect(requireOwnMember(ctx, 40)).resolves.toBe(2)
    expect(db.projectMember.findFirst.mock.calls[0]![0].where).toEqual({
      id: 40,
      users: { some: { id: ME } },
    })
    db.projectMember.findFirst.mockResolvedValue(null)
    await expect(requireOwnMember(ctx, 41)).rejects.toThrow()
  })

  test("a task log is for the project's managers and the people it is assigned to", async () => {
    const log = (projectId: number, userIds: number[]) => ({
      task: { projectId },
      assignedTo: { users: userIds.map((id) => ({ id })) },
    })
    db.taskLog.findUnique.mockResolvedValue(log(1, [99])) // I manage it
    await expect(requireTaskLogParticipant(ctx, 1)).resolves.toEqual({
      projectId: 1,
      isManager: true,
    })
    db.taskLog.findUnique.mockResolvedValue(log(2, [ME])) // assigned to me
    await expect(requireTaskLogParticipant(ctx, 2)).resolves.toEqual({
      projectId: 2,
      isManager: false,
    })
    db.taskLog.findUnique.mockResolvedValue(log(2, [99])) // someone else's, I'm only a contributor
    await expect(requireTaskLogParticipant(ctx, 3)).rejects.toThrow()
    db.taskLog.findUnique.mockResolvedValue(null)
    await expect(requireTaskLogParticipant(ctx, 4)).rejects.toThrow()
  })

  describe("invitations", () => {
    beforeEach(() => {
      db.user.findUnique.mockResolvedValue({ email: "Me@Example.com" })
    })
    const invite = (projectId: number, email: string) =>
      db.invitation.findUnique.mockResolvedValue({ projectId, email })

    test("the person it is for can act on it, whatever the email's capitalisation", async () => {
      invite(3, "me@example.com")
      await expect(
        requireInviteAccess(ctx, 1, { allowInvitee: true, allowManager: true })
      ).resolves.toBeUndefined()
    })

    test("someone else's invitation is refused, even though ids are guessable", async () => {
      invite(3, "somebody.else@example.com")
      await expect(
        requireInviteAccess(ctx, 1, { allowInvitee: true, allowManager: true })
      ).rejects.toThrow()
    })

    test("a manager can manage their project's invitations but can't accept them for someone", async () => {
      invite(1, "somebody.else@example.com")
      await expect(
        requireInviteAccess(ctx, 1, { allowInvitee: true, allowManager: true })
      ).resolves.toBeUndefined()
      await expect(
        requireInviteAccess(ctx, 1, { allowInvitee: true, allowManager: false })
      ).rejects.toThrow()
    })
  })

  test("changing a member's privilege needs a manager, and the user must be that member", async () => {
    db.projectMember.findFirst.mockResolvedValue({ id: 5 })
    await expect(requireManagerOfMemberUser(ctx, 5, 1, 20)).resolves.toBeUndefined()
    await expect(requireManagerOfMemberUser(ctx, 5, 2, 20)).rejects.toThrow() // contributor, not manager
    db.projectMember.findFirst.mockResolvedValue(null)
    await expect(requireManagerOfMemberUser(ctx, 5, 1, 21)).rejects.toThrow() // user isn't that member
  })

  test("forms and folders belong to their owner", async () => {
    db.form.findMany.mockResolvedValue([{ userId: ME }])
    await expect(requireFormOwner(ctx, [1])).resolves.toBeUndefined()
    db.form.findMany.mockResolvedValue([{ userId: 99 }])
    await expect(requireFormOwner(ctx, [1])).rejects.toThrow()
    db.formVersion.findMany.mockResolvedValue([{ form: { userId: 99 } }])
    await expect(requireFormVersionOwner(ctx, [1])).rejects.toThrow()
    db.folder.findFirst.mockResolvedValue(null)
    await expect(requireFolderOwner(ctx, 1)).rejects.toThrow()
    expect(db.folder.findFirst.mock.calls[0]![0].where).toEqual({ id: 1, userId: ME })
  })

  test("a role is its maker's, or its project's managers'", async () => {
    db.role.findMany.mockResolvedValue([{ userId: ME, projectId: null }])
    await expect(requireRoleAccess(ctx, [1])).resolves.toBeUndefined()
    db.role.findMany.mockResolvedValue([{ userId: 99, projectId: 1 }]) // someone else's, my project
    await expect(requireRoleAccess(ctx, [1])).resolves.toBeUndefined()
    db.role.findMany.mockResolvedValue([{ userId: 99, projectId: 2 }]) // contributor project
    await expect(requireRoleAccess(ctx, [1])).rejects.toThrow()
    db.role.findMany.mockResolvedValue([{ userId: 99, projectId: null }])
    await expect(requireRoleAccess(ctx, [1])).rejects.toThrow()
  })
})
