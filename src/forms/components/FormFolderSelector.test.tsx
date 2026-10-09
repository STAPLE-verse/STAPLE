import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"

const saveMeta = vi.fn()
const createFolderFn = vi.fn()
const toastError = vi.fn()
let folders = [
  { id: 1, name: "Surveys" },
  { id: 2, name: "Experiments" },
]
const refetch = vi.fn(async () => undefined)

vi.mock("@blitzjs/rpc", () => ({
  useQuery: () => [folders, { refetch }],
  // the first useMutation in the component is updateFormMeta, the second createFolder
  useMutation: (mutation: { name?: string }) => [
    (...args: unknown[]) =>
      mutation.name === "createFolder" ? createFolderFn(...args) : saveMeta(...args),
  ],
}))
vi.mock("src/folders/queries/getFolders", () => ({ default: {} }))
vi.mock("src/folders/mutations/createFolder", () => ({ default: { name: "createFolder" } }))
vi.mock("src/forms/mutations/updateFormMeta", () => ({ default: { name: "updateFormMeta" } }))
vi.mock("react-hot-toast", () => ({ default: { error: (...a: unknown[]) => toastError(...a) } }))

import FormFolderSelector from "./FormFolderSelector"

const dropdown = () => screen.getByRole("combobox") as HTMLSelectElement

describe("FormFolderSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    saveMeta.mockResolvedValue({})
  })
  afterEach(cleanup)

  test("shows the folder the form is in", () => {
    render(<FormFolderSelector formId={5} currentFolderId={2} />)
    expect(dropdown().value).toBe("2")
  })

  test("keeps showing the folder you chose, even though the page never passes the new one back", async () => {
    render(<FormFolderSelector formId={5} currentFolderId={null} />)
    fireEvent.change(dropdown(), { target: { value: "2" } })

    await waitFor(() => expect(saveMeta).toHaveBeenCalledWith({ id: 5, folderId: 2 }))
    expect(dropdown().value).toBe("2")
  })

  test("choosing No folder is shown and saved as no folder", async () => {
    render(<FormFolderSelector formId={5} currentFolderId={1} />)
    fireEvent.change(dropdown(), { target: { value: "" } })

    await waitFor(() => expect(saveMeta).toHaveBeenCalledWith({ id: 5, folderId: null }))
    expect(dropdown().value).toBe("")
  })

  test("goes back to the previous folder and says so if saving fails", async () => {
    saveMeta.mockRejectedValue(new Error("offline"))
    render(<FormFolderSelector formId={5} currentFolderId={1} />)
    fireEvent.change(dropdown(), { target: { value: "2" } })

    await waitFor(() => expect(toastError).toHaveBeenCalled())
    expect(dropdown().value).toBe("1")
  })

  test("follows the page if it does pass a different folder later", () => {
    const { rerender } = render(<FormFolderSelector formId={5} currentFolderId={1} />)
    rerender(<FormFolderSelector formId={5} currentFolderId={2} />)
    expect(dropdown().value).toBe("2")
  })

  test("a newly created folder is selected", async () => {
    createFolderFn.mockImplementation(async () => {
      folders = [...folders, { id: 3, name: "New one" }]
      return { id: 3, name: "New one" }
    })
    render(<FormFolderSelector formId={5} currentFolderId={null} />)
    fireEvent.click(screen.getByText("+ New folder"))
    fireEvent.change(screen.getByPlaceholderText("Folder name"), { target: { value: "New one" } })
    fireEvent.click(screen.getByText("Create"))

    await waitFor(() => expect(saveMeta).toHaveBeenCalledWith({ id: 5, folderId: 3 }))
    await waitFor(() => expect(dropdown().value).toBe("3"))
  })
})
