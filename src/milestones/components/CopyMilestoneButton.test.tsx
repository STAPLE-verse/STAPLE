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

const openDialog = (taskCount = 3) => {
  render(<CopyMilestoneButton milestoneId={5} projectId={3} taskCount={taskCount} />)
  fireEvent.click(screen.getByRole("button", { name: "Copy Milestone" }))
}

describe("CopyMilestoneButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    copyFn.mockResolvedValue({ id: 42 })
  })
  afterEach(cleanup)

  test("nothing is copied until a choice is made", () => {
    openDialog()
    expect(screen.getByText("Copy milestone and 3 tasks")).toBeTruthy()
    expect(copyFn).not.toHaveBeenCalled()
  })

  test("copy milestone only, then open the copy", async () => {
    openDialog()
    fireEvent.click(screen.getByRole("button", { name: "Copy milestone only" }))
    await waitFor(() => expect(push).toHaveBeenCalledWith("/projects/3/milestones/42"))
    expect(copyFn).toHaveBeenCalledWith({ id: 5, includeTasks: false })
  })

  test("copy the milestone and its tasks, then open the copy", async () => {
    openDialog()
    fireEvent.click(screen.getByRole("button", { name: "Copy milestone and 3 tasks" }))
    await waitFor(() => expect(push).toHaveBeenCalledWith("/projects/3/milestones/42"))
    expect(copyFn).toHaveBeenCalledWith({ id: 5, includeTasks: true })
  })

  test("says '1 task' for a single task", () => {
    openDialog(1)
    expect(screen.getByRole("button", { name: "Copy milestone and 1 task" })).toBeTruthy()
  })

  test("a milestone with no tasks can only be copied on its own", () => {
    openDialog(0)
    const withTasks = screen.getByRole("button", {
      name: "Copy milestone and tasks",
    }) as HTMLButtonElement
    expect(withTasks.disabled).toBe(true)
    expect(
      (screen.getByRole("button", { name: "Copy milestone only" }) as HTMLButtonElement).disabled
    ).toBe(false)
  })

  test("cancel closes the dialog without copying", async () => {
    openDialog()
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByText("Copy milestone only")).toBeNull())
    expect(copyFn).not.toHaveBeenCalled()
  })

  test("stays on the page if the copy fails", async () => {
    copyFn.mockRejectedValue(new Error("nope"))
    openDialog()
    fireEvent.click(screen.getByRole("button", { name: "Copy milestone only" }))
    await waitFor(() => expect(copyFn).toHaveBeenCalled())
    expect(push).not.toHaveBeenCalled()
  })
})
