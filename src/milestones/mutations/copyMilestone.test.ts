import { beforeEach, describe, expect, test, vi } from "vitest"

// vi.mock is hoisted above these, so the mock reaches them lazily at call time
let privileges: Array<{ projectId: number; privilege: string }> = []
const milestoneFindMany = vi.fn()
const findUniqueOrThrow = vi.fn()
const milestoneCreate = vi.fn()
const taskCreate = vi.fn()
const taskCount = vi.fn()
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
      milestone: {
        findMany: (...a: unknown[]) => milestoneFindMany(...a),
        findUniqueOrThrow: (...a: unknown[]) => findUniqueOrThrow(...a),
      },
      $transaction: async (fn: (client: typeof tx) => unknown) => fn(tx),
    },
    MemberPrivileges: { PROJECT_MANAGER: "PROJECT_MANAGER", CONTRIBUTOR: "CONTRIBUTOR" },
  }
})

import copyMilestone from "./copyMilestone"

const ctx: any = { session: { userId: 7, $isAuthorized: () => true, $authorize: () => undefined } }

const task = (id: number, containerId: number, over: any = {}) => ({
  id,
  name: `Task ${id}`,
  description: `About ${id}`,
  deadline: new Date("2026-02-01"),
  startDate: new Date("2026-01-15"),
  tags: [{ key: "t", value: "x" }],
  containerId,
  containerTaskOrder: 99,
  milestoneId: 5,
  formVersionId: 12,
  elementId: null,
  status: "COMPLETED",
  autoAssignNew: "NONE",
  anonymous: false,
  anonymousResponses: true,
  createdById: 400,
  roles: [{ id: 31 }],
  ...over,
})

const original = {
  id: 5,
  name: "Data collection",
  description: "Collect the data",
  projectId: 3,
  tags: [{ key: "a", value: "wave 1" }],
  startDate: new Date("2026-01-01"),
  endDate: new Date("2026-03-01"),
  task: [task(1, 10), task(2, 10), task(3, 11)],
}

describe("copyMilestone", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    privileges = [{ projectId: 3, privilege: "PROJECT_MANAGER" }]
    milestoneFindMany.mockResolvedValue([{ projectId: 3 }])
    findUniqueOrThrow.mockResolvedValue(original)
    milestoneCreate.mockImplementation(async ({ data }: any) => ({ id: 6, ...data }))
    taskCreate.mockResolvedValue({})
    taskCount.mockImplementation(async ({ where }: any) => (where.containerId === 10 ? 4 : 0))
    memberFindFirst.mockResolvedValue({ id: 77 })
  })

  test("by default copies only the milestone's details, and leaves its tasks alone", async () => {
    const copy = await copyMilestone({ id: 5 }, ctx)
    expect(milestoneCreate).toHaveBeenCalledWith({
      data: {
        name: "Data collection (Copy)",
        description: "Collect the data",
        projectId: 3,
        tags: [{ key: "a", value: "wave 1" }],
        startDate: original.startDate,
        endDate: original.endDate,
      },
    })
    expect(copy).toMatchObject({ id: 6, copiedTaskCount: 0 })
    expect(taskCreate).not.toHaveBeenCalled()
    // the tasks weren't even read
    expect(findUniqueOrThrow.mock.calls[0]![0].include).toBeUndefined()
  })

  test("with tasks, copies each as a new, unassigned task under the copy, at the end of its column", async () => {
    const copy = await copyMilestone({ id: 5, includeTasks: true }, ctx)
    expect(copy.copiedTaskCount).toBe(3)
    expect(taskCreate).toHaveBeenCalledTimes(3)

    const created = taskCreate.mock.calls.map((call) => call[0].data)
    // everything lands under the new milestone, in this project, created by the person copying
    expect(
      created.every((d) => d.milestoneId === 6 && d.projectId === 3 && d.createdById === 77)
    ).toBe(true)
    // same details, form and roles; progress is reset
    expect(created[0]).toMatchObject({
      name: "Task 1",
      description: "About 1",
      deadline: new Date("2026-02-01"),
      formVersionId: 12,
      anonymousResponses: true,
      status: "NOT_COMPLETED",
      roles: { connect: [{ id: 31 }] },
    })
    // column 10 already holds 4 tasks, so the two copies take places 4 and 5; column 11 is empty
    expect(created.map((d) => [d.containerId, d.containerTaskOrder])).toEqual([
      [10, 4],
      [10, 5],
      [11, 0],
    ])
    // nobody is assigned and nothing about logs or comments is carried over
    for (const data of created) {
      expect(data).not.toHaveProperty("assignedMembers")
      expect(data).not.toHaveProperty("taskLogs")
    }
  })

  test("copes with a milestone that has no tasks, description, tags or dates", async () => {
    findUniqueOrThrow.mockResolvedValue({
      ...original,
      description: null,
      tags: null,
      startDate: null,
      endDate: null,
      task: [],
    })
    const copy = await copyMilestone({ id: 5, includeTasks: true }, ctx)
    const { data } = milestoneCreate.mock.calls[0]![0]
    expect(data.description).toBeNull()
    expect(data.tags).toBeUndefined()
    expect(data.startDate).toBeUndefined()
    expect(copy.copiedTaskCount).toBe(0)
    expect(taskCreate).not.toHaveBeenCalled()
  })

  test("stops before copying any task if the caller isn't a member row of the project", async () => {
    memberFindFirst.mockResolvedValue(null)
    await expect(copyMilestone({ id: 5, includeTasks: true }, ctx)).rejects.toThrow()
    expect(taskCreate).not.toHaveBeenCalled()
  })

  test("only a project manager of that project may copy it, with or without tasks", async () => {
    for (const mine of [[], [{ projectId: 3, privilege: "CONTRIBUTOR" }]]) {
      privileges = mine
      for (const includeTasks of [false, true]) {
        await expect(copyMilestone({ id: 5, includeTasks }, ctx)).rejects.toThrow()
      }
    }
    expect(milestoneCreate).not.toHaveBeenCalled()
    expect(taskCreate).not.toHaveBeenCalled()
  })
})
