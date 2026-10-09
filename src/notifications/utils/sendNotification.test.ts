import { existsSync } from "fs"
import path from "path"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { z } from "zod"

const create = vi.fn()
vi.mock("db", () => ({
  default: { notification: { create: (...args: unknown[]) => create(...args) } },
}))
vi.mock("../schemas", () => ({
  getDynamicSchema: (templateId: string) => {
    if (templateId !== "greeting") throw new Error(`No schema found for template: ${templateId}`)
    return z.object({ name: z.string() })
  },
}))
vi.mock("./compileTemplate", () => ({
  compileTemplate: async (_id: string, data: { name: string }) => `Hello ${data.name}`,
}))

import { sendNotification } from "./sendNotification"

describe("sendNotification (internal helper)", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    create.mockResolvedValue({ id: 1 })
  })

  test("creates a notification for the given people, from STAPLE", async () => {
    await sendNotification({
      templateId: "greeting",
      recipients: [3, 4],
      projectId: 9,
      data: { name: "Ada" },
      routeData: { path: "/projects/9" },
    })
    expect(create).toHaveBeenCalledWith({
      data: {
        message: "Hello Ada",
        recipients: { connect: [{ id: 3 }, { id: 4 }] },
        projectId: 9,
        routeData: { path: "/projects/9" },
        source: "STAPLE",
      },
    })
  })

  test("leaves the project out when there isn't one, and ignores the context argument", async () => {
    await sendNotification({ templateId: "greeting", recipients: [3], data: { name: "Ada" } }, {})
    expect(create.mock.calls[0]![0].data).not.toHaveProperty("projectId")
  })

  test("refuses data that doesn't fit the template, and an unknown template, without writing", async () => {
    await expect(
      sendNotification({ templateId: "greeting", recipients: [3], data: { name: 5 } })
    ).rejects.toThrow("Data validation failed")
    await expect(
      sendNotification({ templateId: "nope", recipients: [3], data: {} })
    ).rejects.toThrow("No schema found")
    expect(create).not.toHaveBeenCalled()
  })

  test("refuses malformed input", async () => {
    await expect(
      sendNotification({ templateId: "greeting", recipients: ["x"] as any, data: {} })
    ).rejects.toThrow()
    expect(create).not.toHaveBeenCalled()
  })
})

describe("notifications can't be sent from the browser", () => {
  test("there is no sendNotification endpoint", () => {
    // Anything in a `mutations` folder can be called by any signed-in user. This one can notify
    // anybody with a message the caller chooses, so it lives in utils, for server code only.
    const endpoint = path.join(process.cwd(), "src/notifications/mutations/sendNotification.ts")
    expect(existsSync(endpoint)).toBe(false)
  })
})
