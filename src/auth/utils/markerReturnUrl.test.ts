import { describe, expect, it } from "vitest"
import { getMarkerReturnUrl } from "./markerReturnUrl"

const MARKER = "https://marker.example.org"

describe("getMarkerReturnUrl", () => {
  it("returns null for an ordinary STAPLE sign-up", () => {
    expect(getMarkerReturnUrl({}, MARKER)).toBeNull()
    expect(getMarkerReturnUrl({ from: "elsewhere" }, MARKER)).toBeNull()
  })

  it("returns null when no MARKER address is configured", () => {
    expect(getMarkerReturnUrl({ from: "marker" }, undefined)).toBeNull()
    expect(getMarkerReturnUrl({ from: "marker" }, "")).toBeNull()
  })

  it("sends MARKER arrivals to MARKER's login", () => {
    expect(getMarkerReturnUrl({ from: "marker" }, MARKER)).toBe(`${MARKER}/login?registered=1`)
  })

  it("tolerates a trailing slash on the configured address", () => {
    expect(getMarkerReturnUrl({ from: "marker" }, `${MARKER}/`)).toBe(
      `${MARKER}/login?registered=1`
    )
  })

  it("passes a same-site next path through", () => {
    expect(getMarkerReturnUrl({ from: "marker", next: "/schemas/ps_abc" }, MARKER)).toBe(
      `${MARKER}/login?registered=1&next=%2Fschemas%2Fps_abc`
    )
  })

  it("drops a next value that would leave MARKER", () => {
    for (const next of ["https://evil.example", "//evil.example", "/\\evil.example", "evil"]) {
      expect(getMarkerReturnUrl({ from: "marker", next }, MARKER)).toBe(
        `${MARKER}/login?registered=1`
      )
    }
  })

  it("never takes the destination host from the query", () => {
    const url = getMarkerReturnUrl({ from: "https://evil.example", next: "/x" }, MARKER)
    expect(url).toBeNull()
  })
})
