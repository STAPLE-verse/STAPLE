import { describe, expect, test } from "vitest"
import { parseLabels, taskNameForLabel } from "./copyTaskSetInput"

describe("parseLabels", () => {
  test("one label per line, trimmed, blank lines dropped", () => {
    expect(parseLabels("Interview 2\n  Interview 3  \n\n\nInterview 4\r\nInterview 5\n")).toEqual([
      "Interview 2",
      "Interview 3",
      "Interview 4",
      "Interview 5",
    ])
  })

  test("repeats are dropped, whatever the capitalisation", () => {
    expect(parseLabels("A\nB\na\nA ")).toEqual(["A", "B"])
  })

  test("nothing typed means no labels", () => {
    expect(parseLabels("")).toEqual([])
    expect(parseLabels("  \n \n")).toEqual([])
  })
})

describe("taskNameForLabel", () => {
  test("puts the label after the task name", () => {
    expect(taskNameForLabel("Transcribe", "Interview 2")).toBe("Transcribe - Interview 2")
  })
})
