import { beforeEach, describe, expect, test, vi } from "vitest"

// vi.mock is hoisted above these, so the mock reaches them lazily at call time
let privileges: Array<{ projectId: number; privilege: string }> = []
const milestoneFindMany = vi.fn()
const findUniqueOrThrow = vi.fn()
const create = vi.fn()
vi.mock("db", () => ({
  default: {
    projectPrivilege: { findMany: async () => privileges },
    milestone: {
      findMany: (...a: unknown[]) => milestoneFindMany(...a),
      findUniqueOrThrow: (...a: unknown[]) => findUniqueOrThrow(...a),
      create: (...a: unknown[]) => create(...a),
    },
  },
  MemberPrivileges: { PROJECT_MANAGER: "PROJECT_MANAGER", CONTRIBUTOR: "CONTRIBUTOR" },
}))

import copyMilestone from "./copyMilestone"

const ctx: any = { session: { userId: 7, $isAuthorized: () => true, $authorize: () => undefined } }

const original = {
  id: 5,
  name: "Data collection",
  description: "Collect the data",
  projectId: 3,
  tags: [{ key: "a", value: "wave 1" }],
  startDate: new Date("2026-01-01"),
  endDate: new Date("2026-03-01"),
  createdAt: new Date("2025-12-01"),
  updatedAt: new Date("2025-12-02"),
}

describe("copyMilestone", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    privileges = [{ projectId: 3, privilege: "PROJECT_MANAGER" }]
    milestoneFindMany.mockResolvedValue([{ projectId: 3 }])
    findUniqueOrThrow.mockResolvedValue(original)
    create.mockImplementation(async ({ data }: any) => ({ id: 6, ...data }))
  })

  test("copies the details into the same project, marked as a copy, without its tasks", async () => {
    const copy = await copyMilestone({ id: 5 }, ctx)
    expect(create).toHaveBeenCalledWith({
      data: {
        name: "Data collection (Copy)",
        description: "Collect the data",
        projectId: 3,
        tags: [{ key: "a", value: "wave 1" }],
        startDate: original.startDate,
        endDate: original.endDate,
      },
    })
    expect(copy.id).toBe(6)
    // nothing about tasks is passed on: they stay with the original
    expect(create.mock.calls[0]![0].data).not.toHaveProperty("task")
  })

  test("copes with a milestone that has no description, tags or dates", async () => {
    findUniqueOrThrow.mockResolvedValue({
      ...original,
      description: null,
      tags: null,
      startDate: null,
      endDate: null,
    })
    await copyMilestone({ id: 5 }, ctx)
    const { data } = create.mock.calls[0]![0]
    expect(data.description).toBeNull()
    expect(data.tags).toBeUndefined()
    expect(data.startDate).toBeUndefined()
    expect(data.endDate).toBeUndefined()
  })

  test("only a project manager of that project may copy it", async () => {
    for (const mine of [[], [{ projectId: 3, privilege: "CONTRIBUTOR" }]]) {
      privileges = mine
      await expect(copyMilestone({ id: 5 }, ctx)).rejects.toThrow()
    }
    expect(create).not.toHaveBeenCalled()
  })
})
