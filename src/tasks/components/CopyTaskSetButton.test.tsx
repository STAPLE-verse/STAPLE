import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"

const copyFn = vi.fn()
const invalidate = vi.fn(async (..._args: unknown[]) => undefined)
const toastPromise = vi.fn((promise: Promise<unknown>) => promise)
const tasks = [
  { id: 1, name: "Transcribe", container: { name: "To Do" } },
  { id: 2, name: "Code", container: { name: "To Do" } },
  { id: 3, name: "Review", container: { name: "In Progress" } },
]

vi.mock("@blitzjs/rpc", () => ({
  useQuery: () => [{ tasks }],
  useMutation: () => [(...a: unknown[]) => copyFn(...a), { isLoading: false }],
  invalidateQuery: (...a: unknown[]) => invalidate(...a),
}))
vi.mock("react-hot-toast", () => ({
  default: { promise: (...a: [Promise<unknown>]) => toastPromise(...a) },
}))
vi.mock("../queries/getTasks", () => ({ default: {} }))
vi.mock("../queries/getColumns", () => ({ default: {} }))
vi.mock("src/milestones/queries/getMilestones", () => ({ default: {} }))
vi.mock("../mutations/copyTaskSet", () => ({ default: {} }))

import { CopyTaskSetButton } from "./CopyTaskSetButton"

const open = () => {
  render(<CopyTaskSetButton projectId={3} />)
  fireEvent.click(screen.getByRole("button", { name: "Copy Set of Tasks" }))
}
const create = () => screen.getByRole("button", { name: "Create copies" }) as HTMLButtonElement
const type = (text: string) =>
  fireEvent.change(screen.getByLabelText("One label per line"), { target: { value: text } })

describe("CopyTaskSetButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    copyFn.mockResolvedValue({ taskCount: 4, milestoneCount: 0 })
  })
  afterEach(cleanup)

  test("lists the project's tasks and can't create until tasks and labels are given", () => {
    open()
    expect(screen.getByText("Transcribe")).toBeTruthy()
    expect(create().disabled).toBe(true)

    fireEvent.click(screen.getByLabelText(/Transcribe/))
    expect(create().disabled).toBe(true) // still no labels
    type("Interview 2")
    expect(create().disabled).toBe(false)
  })

  test("previews how many tasks it will make and what the first is called", () => {
    open()
    fireEvent.click(screen.getByLabelText(/Transcribe/))
    fireEvent.click(screen.getByLabelText(/Code/))
    type("Interview 2\nInterview 3\n\nInterview 3")
    expect(screen.getByText(/create 4 tasks/).textContent).toContain('"Transcribe - Interview 2"')
  })

  test("creates the copies, then refreshes the lists and closes", async () => {
    open()
    fireEvent.click(screen.getByLabelText(/Transcribe/))
    fireEvent.click(screen.getByLabelText(/Review/))
    type("Interview 2\nInterview 3")
    fireEvent.click(create())

    await waitFor(() =>
      expect(copyFn).toHaveBeenCalledWith({
        projectId: 3,
        taskIds: [1, 3],
        labels: ["Interview 2", "Interview 3"],
        ownMilestones: false,
      })
    )
    await waitFor(() => expect(invalidate).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(screen.queryByText("Copy a set of tasks")).toBeNull())
  })

  test("can ask for a milestone per set", async () => {
    open()
    fireEvent.click(screen.getByLabelText(/Code/))
    type("Interview 2")
    fireEvent.click(screen.getByLabelText(/own new milestone/))
    expect(screen.getByText(/and 1 milestone/)).toBeTruthy()
    fireEvent.click(create())
    await waitFor(() =>
      expect(copyFn).toHaveBeenCalledWith(expect.objectContaining({ ownMilestones: true }))
    )
  })

  test("warns, and won't create, when it would be too many", () => {
    open()
    fireEvent.click(screen.getByLabelText(/Transcribe/))
    type(Array.from({ length: 51 }, (_, i) => `Label ${i}`).join("\n"))
    expect(screen.getByText(/too many at once/)).toBeTruthy()
    expect(create().disabled).toBe(true)
  })

  test("cancel closes without copying", async () => {
    open()
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByText("Copy a set of tasks")).toBeNull())
    expect(copyFn).not.toHaveBeenCalled()
  })

  test("stays open if the copy fails", async () => {
    copyFn.mockRejectedValue(new Error("nope"))
    open()
    fireEvent.click(screen.getByLabelText(/Transcribe/))
    type("Interview 2")
    fireEvent.click(create())
    await waitFor(() => expect(copyFn).toHaveBeenCalled())
    expect(screen.getByText("Copy a set of tasks")).toBeTruthy()
  })
})
