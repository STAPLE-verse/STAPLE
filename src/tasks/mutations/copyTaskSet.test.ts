import { beforeEach, describe, expect, test, vi } from "vitest"

// vi.mock is hoisted above these, so the mock reaches them lazily at call time
let privileges: Array<{ projectId: number; privilege: string }> = []
let taskProjects: number[] = []
let originals: any[] = []
const taskCreate = vi.fn()
const taskCount = vi.fn()
const milestoneCreate = vi.fn()
const memberFindFirst = vi.fn()

vi.mock("db", () => {
  const tx = {
    milestone: { create: (...a: unknown[]) => milestoneCreate(...a) },
    task: {
      create: (...a: unknown[]) => taskCreate(...a),
      count: (...a: unknown[]) => taskCount(...a),
    },
    projectMember: { findFirst: (...a: unknown[]) => memberFindFirst(...a) },
  }
  return {
    default: {
      projectPrivilege: { findMany: async () => privileges },
      task: {
        // the access check asks for each task's project; the copy asks for the tasks themselves
        findMany: async (args: any) =>
          args.select ? taskProjects.map((projectId) => ({ projectId })) : originals,
      },
      $transaction: async (fn: (client: typeof tx) => unknown) => fn(tx),
    },
    MemberPrivileges: { PROJECT_MANAGER: "PROJECT_MANAGER", CONTRIBUTOR: "CONTRIBUTOR" },
  }
})

import copyTaskSet from "./copyTaskSet"

const ctx: any = { session: { userId: 7, $isAuthorized: () => true, $authorize: () => undefined } }

const original = (id: number, containerId: number, over: any = {}) => ({
  id,
  name: `Step ${id}`,
  description: `About ${id}`,
  deadline: null,
  startDate: null,
  tags: null,
  containerId,
  formVersionId: id === 1 ? 12 : null,
  elementId: null,
  status: "COMPLETED",
  autoAssignNew: "NONE",
  anonymous: false,
  anonymousResponses: false,
  roles: [{ id: 31 }],
  ...over,
})

describe("copyTaskSet", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    privileges = [{ projectId: 3, privilege: "PROJECT_MANAGER" }]
    taskProjects = [3, 3]
    originals = [original(1, 10), original(2, 10)]
    taskCreate.mockResolvedValue({})
    taskCount.mockResolvedValue(4)
    milestoneCreate.mockImplementation(async ({ data }: any) => ({
      id: 500 + milestoneCreate.mock.calls.length,
      ...data,
    }))
    memberFindFirst.mockResolvedValue({ id: 77 })
  })

  test("makes a whole copy of the set for each label, in order, named after the label", async () => {
    const result = await copyTaskSet(
      { projectId: 3, taskIds: [1, 2], labels: ["Interview 2", "Interview 3"] },
      ctx
    )
    expect(result).toEqual({ taskCount: 4, milestoneCount: 0 })

    const created = taskCreate.mock.calls.map((call) => call[0].data)
    expect(created.map((d) => d.name)).toEqual([
      "Step 1 - Interview 2",
      "Step 2 - Interview 2",
      "Step 1 - Interview 3",
      "Step 2 - Interview 3",
    ])
    // the column already holds 4 tasks, so the copies take the next places in order
    expect(created.map((d) => d.containerTaskOrder)).toEqual([4, 5, 6, 7])
  })

  test("copies are new unassigned tasks with the same details, and no milestone by default", async () => {
    await copyTaskSet({ projectId: 3, taskIds: [1, 2], labels: ["Interview 2"] }, ctx)
    const first = taskCreate.mock.calls[0]![0].data
    expect(first).toMatchObject({
      description: "About 1",
      formVersionId: 12,
      status: "NOT_COMPLETED",
      projectId: 3,
      createdById: 77,
      roles: { connect: [{ id: 31 }] },
    })
    expect(first.milestoneId).toBeUndefined()
    expect(first).not.toHaveProperty("assignedMembers")
    expect(first).not.toHaveProperty("taskLogs")
    expect(milestoneCreate).not.toHaveBeenCalled()
  })

  test("can put each set in its own new milestone named after the label", async () => {
    const result = await copyTaskSet(
      {
        projectId: 3,
        taskIds: [1, 2],
        labels: ["Interview 2", "Interview 3"],
        ownMilestones: true,
      },
      ctx
    )
    expect(result).toEqual({ taskCount: 4, milestoneCount: 2 })
    expect(milestoneCreate.mock.calls.map((c) => c[0].data)).toEqual([
      { name: "Interview 2", projectId: 3 },
      { name: "Interview 3", projectId: 3 },
    ])
    const milestoneIds = taskCreate.mock.calls.map((c) => c[0].data.milestoneId)
    expect(milestoneIds[0]).toBe(milestoneIds[1]) // one set shares a milestone
    expect(milestoneIds[2]).toBe(milestoneIds[3])
    expect(milestoneIds[0]).not.toBe(milestoneIds[2]) // and the next set has its own
  })

  test("refuses a set that includes a task from another project", async () => {
    taskProjects = [3, 99]
    await expect(
      copyTaskSet({ projectId: 3, taskIds: [1, 2], labels: ["Interview 2"] }, ctx)
    ).rejects.toThrow()
    expect(taskCreate).not.toHaveBeenCalled()
  })

  test("refuses when a task can't be found, or the caller has no member row", async () => {
    originals = [original(1, 10)] // asked for two, only one exists
    await expect(
      copyTaskSet({ projectId: 3, taskIds: [1, 2], labels: ["A"] }, ctx)
    ).rejects.toThrow()

    originals = [original(1, 10), original(2, 10)]
    memberFindFirst.mockResolvedValue(null)
    await expect(
      copyTaskSet({ projectId: 3, taskIds: [1, 2], labels: ["A"] }, ctx)
    ).rejects.toThrow()
    expect(taskCreate).not.toHaveBeenCalled()
  })

  test("only a project manager of the project may do it", async () => {
    for (const mine of [[], [{ projectId: 3, privilege: "CONTRIBUTOR" }]]) {
      privileges = mine
      await expect(
        copyTaskSet({ projectId: 3, taskIds: [1, 2], labels: ["A"] }, ctx)
      ).rejects.toThrow()
    }
    expect(taskCreate).not.toHaveBeenCalled()
  })

  test("won't create an unreasonable number of tasks in one go", async () => {
    const taskIds = Array.from({ length: 100 }, (_, i) => i + 1)
    const labels = Array.from({ length: 6 }, (_, i) => `Label ${i}`) // 100 x 6 = 600
    await expect(copyTaskSet({ projectId: 3, taskIds, labels }, ctx)).rejects.toThrow()
    expect(taskCreate).not.toHaveBeenCalled()
  })

  test("needs at least one task and one label", async () => {
    await expect(copyTaskSet({ projectId: 3, taskIds: [], labels: ["A"] }, ctx)).rejects.toThrow()
    await expect(copyTaskSet({ projectId: 3, taskIds: [1], labels: [] }, ctx)).rejects.toThrow()
    await expect(copyTaskSet({ projectId: 3, taskIds: [1], labels: ["  "] }, ctx)).rejects.toThrow()
  })
})
