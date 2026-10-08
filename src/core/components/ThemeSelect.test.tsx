import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"

const saveTheme = vi.fn()
const toastError = vi.fn()
vi.mock("@blitzjs/rpc", () => ({ useMutation: () => [(...args: unknown[]) => saveTheme(...args)] }))
vi.mock("src/users/mutations/updateTheme", () => ({ default: {} }))
vi.mock("react-hot-toast", () => ({
  default: { error: (...args: unknown[]) => toastError(...args) },
}))

import ThemeSelect from "./ThemeSelect"

// An in-memory stand-in: this test environment's own localStorage isn't a full implementation
const memoryStorage = () => {
  let data: Record<string, string> = {}
  return {
    getItem: (key: string) => (key in data ? data[key]! : null),
    setItem: (key: string, value: string) => {
      data[key] = `${value}`
    },
    removeItem: (key: string) => {
      delete data[key]
    },
    clear: () => {
      data = {}
    },
  }
}

describe("ThemeSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal("localStorage", memoryStorage())
    document.documentElement.removeAttribute("data-theme")
    saveTheme.mockResolvedValue({ theme: "nord" })
  })
  afterEach(cleanup)

  test("applies the chosen theme and saves it to the account", async () => {
    render(<ThemeSelect />)
    fireEvent.change(screen.getByTitle("Change Theme"), { target: { value: "nord" } })

    expect(document.documentElement.getAttribute("data-theme")).toBe("nord")
    expect(localStorage.getItem("theme")).toBe("nord")
    await waitFor(() => expect(saveTheme).toHaveBeenCalledWith({ theme: "nord" }))
    expect(toastError).not.toHaveBeenCalled()
  })

  test("keeps the theme applied and says so when saving fails", async () => {
    saveTheme.mockRejectedValue(new Error("offline"))
    render(<ThemeSelect />)
    fireEvent.change(screen.getByTitle("Change Theme"), { target: { value: "retro" } })

    await waitFor(() => expect(toastError).toHaveBeenCalled())
    expect(toastError.mock.calls[0]![0]).toContain("could not be saved")
    expect(document.documentElement.getAttribute("data-theme")).toBe("retro")
  })
})
