import { beforeEach, describe, expect, test, vi } from "vitest"

// A stand-in database that records every call, so we can see what each query was allowed to ask for.
type Call = { model: string; method: string; args: any }
const calls: Call[] = []
let privileges: Array<{ projectId: number; privilege: string }> = []
const responders: Record<string, (args: any) => any> = {}

// Every row looks like it belongs to project 99 and to someone else (user 500)
const someoneElsesRow = (id = 1) => ({
  id,
  projectId: 99,
  userId: 500,
  email: "someone.else@example.com",
  name: "x",
  task: { projectId: 99 },
  form: { userId: 500 },
  assignedTo: { users: [{ id: 500 }] },
  users: [{ id: 500 }],
  versions: [],
  tasks: [],
  projects: [],
})

vi.mock("db", () => ({
  default: new Proxy(
    {},
    {
      get: (_t, model: string) =>
        new Proxy(
          {},
          {
            get: (_m, method: string) => async (args: any) => {
              calls.push({ model, method, args })
              const responder = responders[`${model}.${method}`]
              if (responder) return responder(args)
              if (model === "projectPrivilege" && method === "findMany") return privileges
              if (method === "findMany") {
                const ids: number[] = args?.where?.id?.in ?? []
                return ids.map((id) => someoneElsesRow(id))
              }
              if (method === "count") return 0
              return someoneElsesRow(args?.where?.id)
            },
          }
        ),
    }
  ),
  Prisma: { JsonNull: "JsonNull", Decimal: class Decimal {} },
  MemberPrivileges: { PROJECT_MANAGER: "PROJECT_MANAGER", CONTRIBUTOR: "CONTRIBUTOR" },
  Status: { COMPLETED: "COMPLETED", NOT_COMPLETED: "NOT_COMPLETED" },
}))

const ME = 7
const ctx = (): any => ({
  session: { userId: ME, $isAuthorized: () => true, $authorize: () => undefined },
})
const lastCall = (model: string, method: string) =>
  [...calls].reverse().find((c) => c.model === model && c.method === method)
const whereOf = (model: string, method: string) =>
  JSON.stringify(lastCall(model, method)?.args?.where)

type Case = { name: string; load: () => Promise<any>; input: any }

// Queries that name one project or thing, and must refuse people who aren't part of it
const BY_ID: Case[] = [
  { name: "getProject", load: () => import("src/projects/queries/getProject"), input: { id: 99 } },
  {
    name: "getProjectStats",
    load: () => import("src/projects/queries/getProjectStats"),
    input: { id: 99 },
  },
  {
    name: "getProjectData",
    load: () => import("src/summary/queries/getProjectData"),
    input: { id: 99 },
  },
  {
    name: "countProjectManagers",
    load: () => import("src/projectmembers/queries/countProjectManagers"),
    input: { projectId: 99 },
  },
  {
    name: "getProjectManagerUserIds",
    load: () => import("src/projectmembers/queries/getProjectManagerUserIds"),
    input: { projectId: 99 },
  },
  {
    name: "getProjectManagers",
    load: () => import("src/projectmembers/queries/getProjectManagers"),
    input: { projectId: 99 },
  },
  {
    name: "getContributors",
    load: () => import("src/contributors/queries/getContributors"),
    input: { projectId: 99 },
  },
  {
    name: "getUserProjectMemberIds",
    load: () => import("src/tasks/queries/getUserProjectMemberIds"),
    input: { projectId: 99, userId: 1 },
  },
  {
    name: "getMilestone",
    load: () => import("src/milestones/queries/getMilestone"),
    input: { id: 1 },
  },
  { name: "getTeam", load: () => import("src/teams/queries/getTeam"), input: { id: 1 } },
  {
    name: "getMilestoneTags",
    load: () => import("src/tags/queries/getMilestoneTags"),
    input: { projectId: 99 },
  },
  {
    name: "getPeopleTags",
    load: () => import("src/tags/queries/getPeopleTags"),
    input: { projectId: 99 },
  },
  {
    name: "getTaskTags",
    load: () => import("src/tags/queries/getTaskTags"),
    input: { projectId: 99 },
  },
]
// Queries about another person's or another owner's things
const NOT_YOURS: Case[] = [
  {
    name: "getFormDeployments",
    load: () => import("src/forms/queries/getFormDeployments"),
    input: { formId: 1 },
  },
  {
    name: "getUserWidgets (someone else's)",
    load: () => import("src/widgets/queries/getUserWidgets"),
    input: { userId: 8 },
  },
  {
    name: "getProjectWidgets (someone else's)",
    load: () => import("src/widgets/queries/getProjectWidgets"),
    input: { userId: 8, projectId: 99 },
  },
]

const refused = async (c: Case) => {
  const error: any = await (await c.load()).default(c.input, ctx()).then(
    () => null,
    (e: unknown) => e
  )
  expect(error?.name, `${c.name} should refuse (got: ${error?.message ?? "no error"})`).toBe(
    "NotFoundError"
  )
}

describe("read queries that name a project or an owner", () => {
  beforeEach(() => {
    calls.length = 0
  })

  for (const role of ["outsider", "contributor"] as const) {
    describe(`as a ${
      role === "outsider"
        ? "signed-in user with no part in project 99"
        : "plain contributor in project 99"
    }`, () => {
      beforeEach(() => {
        privileges = role === "contributor" ? [{ projectId: 99, privilege: "CONTRIBUTOR" }] : []
      })
      // Outsiders are refused everywhere; a contributor is only refused where it isn't theirs to see
      const cases = role === "outsider" ? [...BY_ID, ...NOT_YOURS] : NOT_YOURS
      for (const c of cases) test(c.name, () => refused(c))
    })
  }

  describe("and a member of the project is not refused", () => {
    beforeEach(() => {
      privileges = [{ projectId: 99, privilege: "CONTRIBUTOR" }]
    })
    for (const c of BY_ID) {
      test(c.name, async () => {
        const error: any = await (await c.load()).default(c.input, ctx()).then(
          () => null,
          (e: unknown) => e
        )
        // it may stop on something else (the database is a stand-in), but not on access
        expect(error?.name, `${c.name}: ${error?.message}`).not.toBe("NotFoundError")
      })
    }
  })
})

// Queries that take a filter from the browser: it may only ever narrow what the caller can see
const FILTERED: Array<Case & { model: string; method: string; expects: string[] }> = [
  {
    name: "getProjects",
    load: () => import("src/projects/queries/getProjects"),
    input: { where: { name: "x" } },
    model: "project",
    method: "findMany",
    expects: ['"id":{"in":[1,2]}'],
  },
  {
    name: "getProjectMember",
    load: () => import("src/projectmembers/queries/getProjectMember"),
    input: { where: { id: 1 } },
    model: "projectMember",
    method: "findFirst",
    expects: ['"projectId":{"in":[1,2]}'],
  },
  {
    name: "getProjectMembers",
    load: () => import("src/projectmembers/queries/getProjectMembers"),
    input: { where: { deleted: false } },
    model: "projectMember",
    method: "findMany",
    expects: ['"projectId":{"in":[1,2]}'],
  },
  {
    name: "getTask",
    load: () => import("src/tasks/queries/getTask"),
    input: { where: { id: 1 } },
    model: "task",
    method: "findFirst",
    expects: ['"projectId":{"in":[1,2]}'],
  },
  {
    name: "getTasks",
    load: () => import("src/tasks/queries/getTasks"),
    input: { where: { status: "COMPLETED" } },
    model: "task",
    method: "findMany",
    expects: ['"projectId":{"in":[1,2]}'],
  },
  {
    name: "getColumns",
    load: () => import("src/tasks/queries/getColumns"),
    input: { where: { name: "x" } },
    model: "kanbanBoard",
    method: "findMany",
    expects: ['"projectId":{"in":[1,2]}'],
  },
  {
    name: "getMilestones",
    load: () => import("src/milestones/queries/getMilestones"),
    input: { where: { name: "x" } },
    model: "milestone",
    method: "findMany",
    expects: ['"projectId":{"in":[1,2]}'],
  },
  {
    name: "getTaskLog",
    load: () => import("src/tasklogs/queries/getTaskLog"),
    input: { where: { id: 1 } },
    model: "taskLog",
    method: "findFirst",
    expects: ['"projectId":{"in":[1,2]}'],
  },
  {
    name: "getProjectPrivilege",
    load: () => import("src/projectprivileges/queries/getProjectPrivilege"),
    input: { where: { userId: 9 } },
    model: "projectPrivilege",
    method: "findFirst",
    expects: ['"projectId":{"in":[1,2]}'],
  },
  {
    name: "getForms",
    load: () => import("src/forms/queries/getForms"),
    input: { where: { archived: false } },
    model: "form",
    method: "findMany",
    expects: [`"userId":${ME}`],
  },
  {
    name: "getComments",
    load: () => import("src/comments/queries/getComments"),
    input: { where: { taskLogId: 1 } },
    model: "comment",
    method: "findMany",
    expects: ['"projectId":{"in":[1]}', `"id":${ME}`],
  },
  {
    name: "getRoles",
    load: () => import("src/roles/queries/getRoles"),
    input: { where: { name: "x" } },
    model: "role",
    method: "findMany",
    expects: [`"userId":${ME}`, '"projectId":{"in":[1,2]}'],
  },
]

describe("read queries that take a filter from the browser", () => {
  beforeEach(() => {
    calls.length = 0
    privileges = [
      { projectId: 1, privilege: "PROJECT_MANAGER" },
      { projectId: 2, privilege: "CONTRIBUTOR" },
    ]
  })

  for (const c of FILTERED) {
    test(`${c.name} keeps the browser's filter and adds the caller's own limit`, async () => {
      await (await c.load()).default(c.input, ctx())
      const where = whereOf(c.model, c.method)
      expect(where, `${c.name} where`).toBeDefined()
      for (const piece of c.expects) expect(where).toContain(piece)
      // the filter the browser asked for is still in there (it can only narrow, never widen)
      expect(where).toContain(JSON.stringify(Object.values(c.input.where)[0]))
    })
  }

  test("getRole and getForm only find the caller's own, or their projects'", async () => {
    await (await import("src/roles/queries/getRole")).default({ id: 5 }, ctx())
    expect(whereOf("role", "findFirst")).toContain(`"userId":${ME}`)
    expect(whereOf("role", "findFirst")).toContain('"projectId":{"in":[1,2]}')
    // the stand-in form has no versions, so it stops after the lookup; the lookup is what matters
    await (await import("src/forms/queries/getForm")).default({ id: 5 }, ctx()).catch(() => null)
    expect(whereOf("form", "findFirst")).toBe(`{"id":5,"userId":${ME}}`)
  })

  test("getInvites only returns the caller's own invitations, or their projects'", async () => {
    responders["user.findUnique"] = () => ({ email: "Me@Example.com" })
    await (
      await import("src/invites/queries/getInvites")
    ).default({ where: { projectId: 99 } }, ctx())
    const where = whereOf("invitation", "findMany")
    expect(where).toContain('"projectId":99')
    expect(where).toContain('"email":{"equals":"Me@Example.com","mode":"insensitive"}')
    expect(where).toContain('"projectId":{"in":[1]}')
    delete responders["user.findUnique"]
  })

  test("getTags only reads tags from the caller's projects", async () => {
    await (await import("src/tags/queries/getTags")).default({ source: "task" }, ctx())
    expect(whereOf("task", "findMany")).toContain('"projectId":{"in":[1,2]}')
  })

  test("getTeamNames only reports teams in the caller's projects", async () => {
    await (
      await import("src/teams/queries/getTeamNames")
    ).default({ userId: 3, projectId: null }, ctx())
    expect(whereOf("projectMember", "findMany")).toContain('"projectId":{"in":[1,2]}')
  })
})

describe("form responses and chat pulled in through `include`", () => {
  const taskWith = (logs: any[]) => ({ id: 1, projectId: 2, taskLogs: logs })
  const log = (id: number, assignedToId: number) => ({
    id,
    taskId: 1,
    assignedToId,
    status: "COMPLETED",
    metadata: { answer: `secret ${id}` },
    comments: [{ id: id * 10, content: "chat" }],
  })

  beforeEach(() => {
    calls.length = 0
    privileges = [{ projectId: 2, privilege: "CONTRIBUTOR" }]
    // log 10 is assigned to me, 11 to someone else
    responders["taskLog.findMany"] = (args: any) =>
      args?.select
        ? args.where.id.in.map((id: number) => ({
            id,
            task: { projectId: 2 },
            assignedTo: { users: [{ id: id === 10 ? ME : 500 }] },
          }))
        : []
    responders["task.findMany"] = () => [taskWith([log(10, 1), log(11, 2)])]
  })

  test("getTasks keeps my own response and blanks someone else's response and chat", async () => {
    const { tasks } = await (
      await import("src/tasks/queries/getTasks")
    ).default({ include: { taskLogs: { include: { comments: true } } } }, ctx())
    const [mine, theirs] = tasks[0].taskLogs
    expect(mine.metadata).toEqual({ answer: "secret 10" })
    expect(mine.comments).toHaveLength(1)
    expect(theirs.metadata).toBeNull()
    expect(theirs.comments).toEqual([])
    expect(theirs.status).toBe("COMPLETED") // everything else survives
  })

  test("a project manager sees everything in their project", async () => {
    privileges = [{ projectId: 2, privilege: "PROJECT_MANAGER" }]
    const { tasks } = await (
      await import("src/tasks/queries/getTasks")
    ).default({ include: { taskLogs: true } }, ctx())
    expect(tasks[0].taskLogs.map((l: any) => l.metadata)).toEqual([
      { answer: "secret 10" },
      { answer: "secret 11" },
    ])
  })

  test("the tag queries hide other people's responses and chat too", async () => {
    responders["task.findMany"] = () => [taskWith([log(10, 1), log(11, 2)])]
    const tasks = await (
      await import("src/tags/queries/getTaskTags")
    ).default({ projectId: 2 }, ctx())
    expect(tasks[0].taskLogs[0].metadata).toEqual({ answer: "secret 10" })
    expect(tasks[0].taskLogs[1].metadata).toBeNull()
    expect(tasks[0].taskLogs[1].comments).toEqual([])
  })
})
