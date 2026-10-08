import { beforeEach, describe, expect, test, vi } from "vitest"

// vi.mock is hoisted above these, so the mock reaches them lazily at call time
const update = vi.fn()
vi.mock("db", () => ({ default: { user: { update: (...args: unknown[]) => update(...args) } } }))

import updateTheme from "./updateTheme"

const setPublicData = vi.fn()
const ctx: any = {
  session: {
    userId: 7,
    $isAuthorized: () => true,
    $authorize: () => undefined,
    $setPublicData: (...args: unknown[]) => setPublicData(...args),
  },
}

describe("updateTheme", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    update.mockResolvedValue({ theme: "dracula" })
  })

  test("saves the theme on the signed-in user's own account and refreshes the session", async () => {
    await expect(updateTheme({ theme: "dracula" }, ctx)).resolves.toEqual({ theme: "dracula" })
    expect(update).toHaveBeenCalledWith({
      where: { id: 7 },
      data: { theme: "dracula" },
      select: { theme: true },
    })
    expect(setPublicData).toHaveBeenCalledWith({ theme: "dracula" })
  })

  test("rejects a theme that isn't in the list, without touching the database", async () => {
    await expect(updateTheme({ theme: "not-a-theme" }, ctx)).rejects.toThrow()
    expect(update).not.toHaveBeenCalled()
  })
})
