import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"

const copyFn = vi.fn()
const push = vi.fn()
const toastPromise = vi.fn((promise: Promise<unknown>) => promise)

vi.mock("@blitzjs/rpc", () => ({
  useMutation: () => [(...a: unknown[]) => copyFn(...a), { isLoading: false }],
}))
vi.mock("@blitzjs/next", () => ({
  Routes: {
    ShowMilestonePage: ({ projectId, milestoneId }: any) =>
      `/projects/${projectId}/milestones/${milestoneId}`,
  },
}))
vi.mock("next/router", () => ({ useRouter: () => ({ push }) }))
vi.mock("react-hot-toast", () => ({
  default: { promise: (...a: [Promise<unknown>]) => toastPromise(...a) },
}))
vi.mock("../mutations/copyMilestone", () => ({ default: {} }))

import { CopyMilestoneButton } from "./CopyMilestoneButton"

describe("CopyMilestoneButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, "error").mockImplementation(() => undefined)
  })
  afterEach(cleanup)

  test("copies this milestone and opens the copy", async () => {
    copyFn.mockResolvedValue({ id: 42 })
    render(<CopyMilestoneButton milestoneId={5} projectId={3} />)
    fireEvent.click(screen.getByRole("button", { name: "Copy Milestone" }))

    await waitFor(() => expect(push).toHaveBeenCalledWith("/projects/3/milestones/42"))
    expect(copyFn).toHaveBeenCalledWith({ id: 5 })
  })

  test("stays on the page if the copy fails", async () => {
    copyFn.mockRejectedValue(new Error("nope"))
    render(<CopyMilestoneButton milestoneId={5} projectId={3} />)
    fireEvent.click(screen.getByRole("button", { name: "Copy Milestone" }))

    await waitFor(() => expect(copyFn).toHaveBeenCalled())
    expect(push).not.toHaveBeenCalled()
  })
})
