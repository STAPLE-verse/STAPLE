import { beforeEach, describe, expect, test, vi } from "vitest"
import { renderHook } from "@testing-library/react"
import { useInitializeTheme } from "./useTheme"

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

const applied = () => document.documentElement.getAttribute("data-theme")

describe("useInitializeTheme", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryStorage())
    document.documentElement.removeAttribute("data-theme")
  })

  test("uses the browser's stored theme straight away, light if none", () => {
    renderHook(() => useInitializeTheme(undefined))
    expect(applied()).toBe("light")

    localStorage.setItem("theme", "dracula")
    renderHook(() => useInitializeTheme(undefined))
    expect(applied()).toBe("dracula")
  })

  test("the saved account theme wins over the browser's, and is stored for next time", () => {
    localStorage.setItem("theme", "dracula")
    renderHook(() => useInitializeTheme("nord"))
    expect(applied()).toBe("nord")
    expect(localStorage.getItem("theme")).toBe("nord")
  })

  test("follows a change to the saved theme", () => {
    const { rerender } = renderHook(({ saved }) => useInitializeTheme(saved), {
      initialProps: { saved: "nord" as string | undefined },
    })
    rerender({ saved: "retro" })
    expect(applied()).toBe("retro")
  })

  test("ignores a saved theme it doesn't know", () => {
    localStorage.setItem("theme", "dracula")
    renderHook(() => useInitializeTheme("nope"))
    expect(applied()).toBe("dracula")
    expect(localStorage.getItem("theme")).toBe("dracula")
  })
})
