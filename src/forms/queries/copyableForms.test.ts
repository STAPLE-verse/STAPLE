import { beforeEach, describe, expect, test, vi } from "vitest"

// vi.mock is hoisted above these, so the mock reaches them lazily at call time
const findMany = vi.fn()
const findFirst = vi.fn()
vi.mock("db", () => ({
  default: {
    form: {
      findMany: (...args: unknown[]) => findMany(...args),
      findFirst: (...args: unknown[]) => findFirst(...args),
    },
  },
}))

import getCopyableForms from "./getCopyableForms"
import getCopyableFormContents from "./getCopyableFormContents"

const ctx: any = { session: { userId: 7, $isAuthorized: () => true, $authorize: () => undefined } }

describe("getCopyableForms", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("only looks at the signed-in user's own active STAPLE forms", async () => {
    findMany.mockResolvedValue([])
    await getCopyableForms({}, ctx)
    expect(findMany.mock.calls[0]![0].where).toEqual({
      userId: 7,
      archived: false,
      app: "staple",
    })
  })

  test("leaves out the form being edited and forms with no usable version", async () => {
    findMany.mockResolvedValue([
      { id: 1, versions: [{ name: "Earlier study", version: 3 }] },
      { id: 2, versions: [] },
    ])
    const forms = await getCopyableForms({ excludeFormId: 9 }, ctx)
    expect(findMany.mock.calls[0]![0].where.id).toEqual({ not: 9 })
    expect(forms).toEqual([{ id: 1, title: "Earlier study", description: "v3" }])
  })
})

describe("getCopyableFormContents", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("returns the latest schema of the user's own form", async () => {
    findFirst.mockResolvedValue({ versions: [{ schema: { type: "object" }, uiSchema: { a: 1 } }] })
    await expect(getCopyableFormContents({ id: 4 }, ctx)).resolves.toEqual({
      schema: { type: "object" },
      uiSchema: { a: 1 },
    })
    expect(findFirst.mock.calls[0]![0].where).toEqual({
      id: 4,
      userId: 7,
      archived: false,
      app: "staple",
    })
  })

  test("someone else's form (or a missing one) is not found", async () => {
    findFirst.mockResolvedValue(null)
    await expect(getCopyableFormContents({ id: 4 }, ctx)).rejects.toThrow()
  })
})
