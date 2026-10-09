import { beforeEach, describe, expect, test, vi } from "vitest"

const createMany = vi.fn()
const findMany = vi.fn()
vi.mock("db", () => ({
  default: {
    widget: {
      createMany: (...a: unknown[]) => createMany(...a),
      findMany: (...a: unknown[]) => findMany(...a),
    },
  },
  WidgetSize: { SMALL: "SMALL", LARGE: "LARGE" },
}))

import initializeWidgets from "./initializeWidgets"

const ctx: any = { session: { userId: 7, $isAuthorized: () => true, $authorize: () => undefined } }

describe("initializeWidgets", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    findMany.mockResolvedValue([])
  })

  test("sets up the signed-in user's own dashboard", async () => {
    await initializeWidgets(7, ctx)
    expect(createMany).toHaveBeenCalledOnce()
    expect(createMany.mock.calls[0]![0].data.every((w: any) => w.userId === 7)).toBe(true)
  })

  test("refuses to set up (or reset) someone else's dashboard", async () => {
    await expect(initializeWidgets(8, ctx)).rejects.toThrow()
    expect(createMany).not.toHaveBeenCalled()
  })
})
