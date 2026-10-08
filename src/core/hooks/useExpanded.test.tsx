import { beforeEach, describe, expect, test, vi } from "vitest"
import { act, renderHook } from "@testing-library/react"

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

// The hook keeps the choice at module level, so each test loads a fresh copy of it
const loadHook = async () => (await import("./useExpanded")).default

describe("useExpanded", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal("localStorage", memoryStorage())
  })

  test("starts open", async () => {
    const useExpanded = await loadHook()
    const { result } = renderHook(() => useExpanded())
    expect(result.current.expanded).toBe(true)
  })

  test("a closed sidebar stays closed when the layout is rebuilt on the next page", async () => {
    const useExpanded = await loadHook()
    const first = renderHook(() => useExpanded())
    act(() => first.result.current.toggleExpand())
    expect(first.result.current.expanded).toBe(false)
    first.unmount()

    // navigating renders a new Layout, which mounts the hook again
    const second = renderHook(() => useExpanded())
    expect(second.result.current.expanded).toBe(false)
  })

  test("a closed sidebar stays closed after a reload", async () => {
    const before = await loadHook()
    const first = renderHook(() => before())
    act(() => first.result.current.toggleExpand())
    first.unmount()

    // a reload starts with nothing in memory, only what the browser saved
    vi.resetModules()
    const after = await loadHook()
    const { result } = renderHook(() => after())
    expect(result.current.expanded).toBe(false)
  })

  test("reopening is remembered too", async () => {
    const useExpanded = await loadHook()
    const first = renderHook(() => useExpanded())
    act(() => first.result.current.toggleExpand())
    act(() => first.result.current.toggleExpand())
    first.unmount()
    const second = renderHook(() => useExpanded())
    expect(second.result.current.expanded).toBe(true)
  })

  test("still works when the browser won't allow storage", async () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked")
      },
      setItem: () => {
        throw new Error("blocked")
      },
    })
    const useExpanded = await loadHook()
    const first = renderHook(() => useExpanded())
    act(() => first.result.current.toggleExpand())
    first.unmount()
    const second = renderHook(() => useExpanded())
    expect(second.result.current.expanded).toBe(false)
  })
})
