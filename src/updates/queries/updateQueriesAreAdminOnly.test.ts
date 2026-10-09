import { describe, expect, test, vi } from "vitest"

// Any write that gets past the check shows up here
const writes: string[] = []
vi.mock("db", () => {
  const model = (name: string) =>
    new Proxy(
      {},
      {
        get: (_t, method: string) => async () => {
          if (/^(create|update|delete|upsert)/.test(method)) writes.push(`${name}.${method}`)
          return []
        },
      }
    )
  return { default: new Proxy({}, { get: (_t, prop: string) => model(prop) }), WidgetSize: {} }
})

// These maintenance queries change data for every user, so only administrators may run them
// (the Updates page hiding them from others is not protection on its own).
const UPDATES = [
  ["20250101_01_defaultform", () => import("./20250101_01_defaultform")],
  ["20250101_02_linkdefaultform", () => import("./20250101_02_linkdefaultform")],
  ["20250101_03_createmetadata", () => import("./20250101_03_createmetadata")],
  ["20250319_01_dashboardwidgets", () => import("./20250319_01_dashboardwidgets")],
  ["20250529_01_milestonestoelements", () => import("./20250529_01_milestonestoelements")],
] as const

describe("one-off update queries", () => {
  for (const [name, load] of UPDATES) {
    test(`${name} requires an administrator and does nothing for anyone else`, async () => {
      writes.length = 0
      const authorize = vi.fn((..._roles: string[]) => {
        throw new Error("not an administrator")
      })
      const ctx: any = { session: { userId: 7, $authorize: authorize } }

      await expect((await load()).default({}, ctx)).rejects.toThrow("not an administrator")
      expect(authorize).toHaveBeenCalledWith("ADMIN")
      expect(writes).toEqual([])
    })
  }
})
