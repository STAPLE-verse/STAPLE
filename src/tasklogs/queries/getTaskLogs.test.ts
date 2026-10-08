import { beforeEach, describe, expect, test, vi } from "vitest"

// vi.mock is hoisted above these, so the mock reaches them lazily at call time
const privileges = vi.fn()
const taskLogFindMany = vi.fn()
const taskLogCount = vi.fn()
vi.mock("db", () => ({
  default: {
    projectPrivilege: { findMany: (...args: unknown[]) => privileges(...args) },
    taskLog: {
      findMany: (...args: unknown[]) => taskLogFindMany(...args),
      count: (...args: unknown[]) => taskLogCount(...args),
    },
  },
  MemberPrivileges: { PROJECT_MANAGER: "PROJECT_MANAGER", CONTRIBUTOR: "CONTRIBUTOR" },
}))

import getTaskLogs from "./getTaskLogs"

const ME = 7
const ctx: any = { session: { userId: ME, $isAuthorized: () => true, $authorize: () => undefined } }

// Two projects: I manage project 1 and am a contributor in project 2 (project 3 is not mine)
const MY_PRIVILEGES = [
  { projectId: 1, privilege: "PROJECT_MANAGER" },
  { projectId: 2, privilege: "CONTRIBUTOR" },
]

// What the owner lookup returns for each log id
const OWNERS: Record<number, { projectId: number; assignedUserIds: number[] }> = {
  10: { projectId: 1, assignedUserIds: [99] }, // someone else's, in a project I manage
  20: { projectId: 2, assignedUserIds: [ME] }, // mine, in a project where I'm a contributor
  21: { projectId: 2, assignedUserIds: [99] }, // someone else's, in that project
  22: { projectId: 2, assignedUserIds: [ME, 99] }, // a team of mine
}

const fetchedLogs = (...ids: number[]) =>
  ids.map((id) => ({ id, status: "COMPLETED", metadata: { answer: `secret ${id}` } }))

function setUp(ids: number[]) {
  privileges.mockResolvedValue(MY_PRIVILEGES)
  taskLogCount.mockResolvedValue(ids.length)
  taskLogFindMany.mockImplementation(async (args: any) =>
    args.select
      ? args.where.id.in.map((id: number) => ({
          id,
          task: { projectId: OWNERS[id]!.projectId },
          assignedTo: { users: OWNERS[id]!.assignedUserIds.map((userId) => ({ id: userId })) },
        }))
      : fetchedLogs(...ids)
  )
}

describe("getTaskLogs", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("the filter from the browser is narrowed to the user's own projects", async () => {
    setUp([20])
    const requested = { assignedToId: 5 }
    await getTaskLogs({ where: requested }, ctx)
    const expected = { AND: [requested, { task: { projectId: { in: [1, 2] } } }] }
    expect(taskLogFindMany.mock.calls[0]![0].where).toEqual(expected)
    expect(taskLogCount.mock.calls[0]![0].where).toEqual(expected)
  })

  test("with no filter at all it still only covers the user's projects", async () => {
    setUp([])
    await getTaskLogs({}, ctx)
    expect(taskLogFindMany.mock.calls[0]![0].where).toEqual({
      task: { projectId: { in: [1, 2] } },
    })
  })

  test("project managers keep every response in their projects", async () => {
    setUp([10])
    const { taskLogs } = await getTaskLogs({}, ctx)
    expect(taskLogs[0]!.metadata).toEqual({ answer: "secret 10" })
  })

  test("others' responses are blanked, but my own and my teams' are kept, in a project where I'm a contributor", async () => {
    setUp([20, 21, 22])
    const { taskLogs } = await getTaskLogs({}, ctx)
    const byId = Object.fromEntries(taskLogs.map((log: any) => [log.id, log]))
    expect(byId[20].metadata).toEqual({ answer: "secret 20" })
    expect(byId[21].metadata).toBeNull()
    expect(byId[22].metadata).toEqual({ answer: "secret 22" })
    // everything else about the log is still there, so summaries and counts keep working
    expect(byId[21].status).toBe("COMPLETED")
  })

  test("paged results are covered by the same rule", async () => {
    setUp([20, 21])
    const { taskLogs } = await getTaskLogs({ take: 2 }, ctx)
    expect(taskLogs.find((log: any) => log.id === 21)!.metadata).toBeNull()
    expect(taskLogs.find((log: any) => log.id === 20)!.metadata).toEqual({ answer: "secret 20" })
  })

  test("a user with no projects gets a filter that matches nothing", async () => {
    privileges.mockResolvedValue([])
    taskLogFindMany.mockResolvedValue([])
    taskLogCount.mockResolvedValue(0)
    await getTaskLogs({ where: { assignedToId: 5 } }, ctx)
    expect(taskLogFindMany.mock.calls[0]![0].where).toEqual({
      AND: [{ assignedToId: 5 }, { task: { projectId: { in: [] } } }],
    })
  })
})
