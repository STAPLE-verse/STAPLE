import { beforeEach, describe, expect, test, vi } from "vitest"

// A stand-in database that records every write. Reads answer as if every row belongs to project 99
// and to someone else (user 500), so anything the checks let through would show up as a write.
const writes: string[] = []
let privileges: Array<{ projectId: number; privilege: string }> = []
// a project manager does have a member row of their own in the project they manage
let ownMemberRow = false

const WRITE_METHODS = [
  "create",
  "createMany",
  "update",
  "updateMany",
  "delete",
  "deleteMany",
  "upsert",
]

const someoneElsesRow = (id = 1) => ({
  id,
  projectId: 99,
  userId: 500,
  email: "someone.else@example.com",
  task: { projectId: 99 },
  form: { userId: 500 },
  assignedTo: { users: [{ id: 500 }] },
  users: [{ id: 500 }],
  versions: [],
  tasks: [],
  projects: [],
})

vi.mock("db", () => {
  const model = (name: string) =>
    new Proxy(
      {},
      {
        get: (_target, method: string) => async (args: any) => {
          if (WRITE_METHODS.includes(method)) {
            writes.push(`${name}.${method}`)
            return { count: 0, ...someoneElsesRow() }
          }
          if (method === "findMany") {
            if (name === "projectPrivilege") return privileges
            const ids: number[] = args?.where?.id?.in ?? []
            return ids.map((id) => someoneElsesRow(id))
          }
          if (method === "findFirst" || method === "findUnique") {
            // "is this row mine?" lookups (filtered by the caller's own id) find nothing
            const where = JSON.stringify(args?.where ?? {})
            if (
              (where.includes('"some":{"id":7}') && !ownMemberRow) ||
              where.includes('"userId":7')
            )
              return null
            return someoneElsesRow(args?.where?.id)
          }
          return null
        },
      }
    )
  const db: any = new Proxy(
    {},
    {
      get: (_t, prop: string) => {
        if (prop === "$transaction") {
          return async (arg: any) => {
            writes.push("$transaction")
            return typeof arg === "function" ? arg(db) : arg
          }
        }
        return model(prop)
      },
    }
  )
  return {
    default: db,
    Prisma: { JsonNull: "JsonNull" },
    MemberPrivileges: { PROJECT_MANAGER: "PROJECT_MANAGER", CONTRIBUTOR: "CONTRIBUTOR" },
    Status: { COMPLETED: "COMPLETED", NOT_COMPLETED: "NOT_COMPLETED" },
    CompletedAs: { TEAM: "TEAM", INDIVIDUAL: "INDIVIDUAL" },
    AutoAssignNew: { NONE: "NONE", ALL: "ALL" },
    NoteVisibility: { PRIVATE: "PRIVATE", CONTRIBUTORS: "CONTRIBUTORS" },
  }
})

const ctx = (): any => ({
  session: {
    userId: 7,
    $isAuthorized: () => true,
    $authorize: () => undefined,
    $setPublicData: vi.fn(),
  },
})

type Case = {
  name: string
  load: () => Promise<any>
  input: any
  managerInput?: any
  managerOwnsMemberRow?: boolean
}

// Everything here changes data in a project (or a person's own forms, folders and roles). Each
// entry is called with the smallest valid input, aimed at project 99, user 7 being no part of it.
const ids = (...n: number[]) => n
const CASES: Case[] = [
  {
    name: "updateProject",
    load: () => import("src/projects/mutations/updateProject"),
    input: { id: 99, name: "x" },
  },
  {
    name: "deleteProject",
    load: () => import("src/projects/mutations/deleteProject"),
    input: { id: 99 },
  },
  {
    name: "copyProject",
    load: () => import("src/projects/mutations/copyProject"),
    input: { id: 99 },
  },
  {
    name: "createMilestone",
    load: () => import("src/milestones/mutations/createMilestone"),
    input: { name: "x", projectId: 99 },
  },
  {
    name: "copyMilestone",
    load: () => import("src/milestones/mutations/copyMilestone"),
    input: { id: 1 },
  },
  {
    name: "copyMilestone (with its tasks)",
    load: () => import("src/milestones/mutations/copyMilestone"),
    input: { id: 1, includeTasks: true },
  },
  {
    name: "copyTaskSet",
    load: () => import("src/tasks/mutations/copyTaskSet"),
    input: { projectId: 99, taskIds: [1], labels: ["Interview 2"] },
    managerOwnsMemberRow: true,
  },
  {
    name: "deleteMilestone",
    load: () => import("src/milestones/mutations/deleteMilestone"),
    input: { id: 1 },
  },
  {
    name: "updateMilestone",
    load: () => import("src/milestones/mutations/updateMilestone"),
    input: { id: 1, name: "x" },
  },
  {
    name: "updateMilestoneDates",
    load: () => import("src/milestones/mutations/updateMilestoneDates"),
    input: { id: 1 },
  },
  {
    name: "createColumn",
    load: () => import("src/tasks/mutations/createColumn"),
    input: { projectId: 99, name: "x" },
  },
  {
    name: "deleteColumn",
    load: () => import("src/tasks/mutations/deleteColumn"),
    input: { id: 1 },
  },
  {
    name: "updateColumn",
    load: () => import("src/tasks/mutations/updateColumn"),
    input: { id: 1, name: "x" },
  },
  {
    name: "updateColumnOrder",
    load: () => import("src/tasks/mutations/updateColumnOrder"),
    input: { containerIds: ids(1, 2) },
  },
  { name: "deleteTask", load: () => import("src/tasks/mutations/deleteTask"), input: { id: 1 } },
  {
    name: "updateTaskDates",
    load: () => import("src/tasks/mutations/updateTaskDates"),
    input: { id: 1 },
  },
  {
    name: "updateTaskStatus",
    load: () => import("src/tasks/mutations/updateTaskStatus"),
    input: { id: 1, status: "COMPLETED" },
  },
  {
    name: "updateTaskOrder",
    load: () => import("src/tasks/mutations/updateTaskOrder"),
    input: { tasks: [{ taskId: 1, containerId: 1, containerTaskOrder: 0 }] },
  },
  {
    name: "updateTaskRole",
    load: () => import("src/tasks/mutations/updateTaskRole"),
    input: { tasksId: ids(1), rolesId: ids(1), disconnect: false },
  },
  {
    name: "updateTasksForMilestone",
    load: () => import("src/tasks/mutations/updateTasksForMilestone"),
    input: { milestoneId: 1, taskIds: ids(1) },
  },
  {
    name: "createTeam",
    load: () => import("src/teams/mutations/createTeam"),
    input: { projectId: 99, name: "x", userIds: [] },
  },
  { name: "deleteTeam", load: () => import("src/teams/mutations/deleteTeam"), input: { id: 1 } },
  {
    name: "updateTeam",
    load: () => import("src/teams/mutations/updateTeam"),
    input: { id: 1, name: "x", userIds: [] },
  },
  {
    name: "updateProjectMember (self-promotion)",
    load: () => import("src/projectmembers/mutations/updateProjectMember"),
    input: { id: 1, projectId: 99, privilege: "PROJECT_MANAGER", userId: 7 },
    // a manager changing someone else's role in their own project
    managerInput: { id: 1, projectId: 99, privilege: "CONTRIBUTOR", userId: 20 },
  },
  {
    name: "updateProjectMemberRole",
    load: () => import("src/projectmembers/mutations/updateProjectMemberRole"),
    input: { projectMembersId: ids(1), rolesId: ids(1), disconnect: false },
  },
  {
    name: "deleteContributor",
    load: () => import("src/contributors/mutations/deleteContributor"),
    input: { id: 1 },
  },
  {
    name: "createInvite",
    load: () => import("src/invites/mutations/createInvite"),
    input: { projectId: 99, email: "a@b.co", privilege: "CONTRIBUTOR", addedBy: "x" },
  },
  {
    name: "createAnnouncement",
    load: () => import("src/notifications/mutations/createAnnouncement"),
    input: { announcementText: "x", projectId: 99 },
  },
  {
    name: "addProjectManagerWidgets",
    load: () => import("src/widgets/mutations/addProjectManagerWidgets"),
    input: { userId: 7, projectId: 99 },
  },
  {
    name: "removeProjectManagerWidgets",
    load: () => import("src/widgets/mutations/removeProjectManagerWidgets"),
    input: { userId: 7, projectId: 99 },
  },
  {
    name: "updateApproval",
    load: () => import("src/tasklogs/mutations/updateApproval"),
    input: { id: 1, approved: true, completedById: 1 },
  },
]

describe("write endpoints refuse people who have no business changing the data", () => {
  beforeEach(() => {
    writes.length = 0
  })

  for (const role of ["outsider", "contributor"] as const) {
    describe(`as a ${
      role === "outsider"
        ? "signed-in user with no part in the project"
        : "plain contributor in the project"
    }`, () => {
      beforeEach(() => {
        privileges = role === "contributor" ? [{ projectId: 99, privilege: "CONTRIBUTOR" }] : []
      })

      for (const { name, load, input } of CASES) {
        test(`${name}`, async () => {
          const handler = (await load()).default
          const error: any = await handler(input, ctx()).then(
            () => null,
            (e: unknown) => e
          )
          expect(error?.name, `${name} should refuse (got: ${error?.message ?? "no error"})`).toBe(
            "NotFoundError"
          )
          expect(writes).toEqual([])
        })
      }
    })
  }

  describe("and the same calls from a project manager of that project are not refused", () => {
    beforeEach(() => {
      privileges = [{ projectId: 99, privilege: "PROJECT_MANAGER" }]
    })

    for (const { name, load, input, managerInput, managerOwnsMemberRow } of CASES) {
      test(`${name}`, async () => {
        const handler = (await load()).default
        ownMemberRow = !!managerOwnsMemberRow
        const error: any = await handler(managerInput ?? input, ctx())
          .then(
            () => null,
            (e: unknown) => e
          )
          .finally(() => {
            ownMemberRow = false
          })
        // it may still stop on something else (this database is only a stand-in), but not on access
        expect(error?.name, `${name}: ${error?.message}`).not.toBe("NotFoundError")
      })
    }
  })
})
