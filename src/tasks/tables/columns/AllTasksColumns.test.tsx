import React from "react"
import { describe, expect, test, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

// The generated route helpers only exist after a Blitz build, so stand in for the two used here
vi.mock("@blitzjs/next", () => ({
  Routes: {
    ShowTaskPage: ({ projectId, taskId }: { projectId: number; taskId: number }) =>
      `/projects/${projectId}/tasks/${taskId}`,
    ShowProjectPage: ({ projectId }: { projectId: number }) => `/projects/${projectId}`,
  },
}))

// Next's Link needs a router to render; a plain anchor is enough to check where it points
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

import { AllTasksColumns } from "./AllTasksColumns"

const row = {
  name: "Collect data",
  projectName: "Big Study",
  view: { taskId: 3, projectId: 9 },
}

const renderCell = (accessorKey: string, value: string) => {
  const column: any = AllTasksColumns.find((col: any) => col.accessorKey === accessorKey)
  render(column.cell({ getValue: () => value, row: { original: row } }))
}

describe("AllTasksColumns", () => {
  test("the task name links to the task page", () => {
    renderCell("name", "Collect data")
    expect(screen.getByRole("link", { name: "Collect data" }).getAttribute("href")).toBe(
      "/projects/9/tasks/3"
    )
  })

  test("they are buttons: primary for the task, secondary for the project", () => {
    renderCell("name", "Collect data")
    expect(screen.getByRole("link", { name: "Collect data" }).className).toContain("btn-primary")
    cleanup()
    renderCell("projectName", "Big Study")
    expect(screen.getByRole("link", { name: "Big Study" }).className).toContain("btn-secondary")
  })

  test("a long name is shortened on the button but kept in full as a tooltip", () => {
    const longName = "A very long task name that would not fit"
    renderCell("name", longName)
    const link = screen.getByRole("link", { name: "A very long task nam..." })
    expect(link.getAttribute("title")).toBe(longName)
  })

  test("the project name links to the project page", () => {
    renderCell("projectName", "Big Study")
    expect(screen.getByRole("link", { name: "Big Study" }).getAttribute("href")).toBe("/projects/9")
  })
})
