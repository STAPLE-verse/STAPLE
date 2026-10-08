import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render, screen } from "@testing-library/react"

// Project member 41 is the person being viewed; their *user* id (7) is a different number
vi.mock("@blitzjs/next", () => ({
  useParam: (name: string) => ({ contributorId: 41, projectId: 3 }[name]),
  Routes: {
    EditContributorPage: ({ projectId, contributorId }: any) =>
      `/projects/${projectId}/contributors/${contributorId}/edit`,
  },
}))
vi.mock("src/projectprivileges/components/MemberPrivilegesContext", () => ({
  useMemberPrivileges: () => ({ privilege: "PROJECT_MANAGER" }),
}))
vi.mock("src/contributors/hooks/useCurrentContributor", () => ({
  useCurrentContributor: () => ({ projectMember: { id: 99 } }),
}))
vi.mock("src/contributors/hooks/useContributorData", () => ({
  useContributorData: () => ({
    contributorUser: { id: 7, firstName: "Ada", lastName: "Lovelace", username: "ada" },
    contributorPrivilege: "CONTRIBUTOR",
    teamNames: [],
  }),
}))
vi.mock("src/core/layouts/Layout", () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock("src/contributors/components/ContributorInformation", () => ({ default: () => null }))
vi.mock("src/contributors/components/ContributorTeams", () => ({ default: () => null }))
vi.mock("src/contributors/components/DeleteContributor", () => ({ default: () => null }))
vi.mock("src/projectmembers/components/ProjectMemberTaskList", () => ({ default: () => null }))
vi.mock("src/tasklogs/tables/columns/TaskLogProjectMemberColumns", () => ({
  TaskLogProjectMemberColumns: [],
}))
vi.mock("react-tooltip", () => ({ Tooltip: () => null }))
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

import { ContributorPage } from "src/pages/projects/[projectId]/contributors/[contributorId]"

describe("contributor page", () => {
  test("Edit Contributor opens the edit page for this project member, not for their user id", () => {
    render(<ContributorPage />)
    expect(screen.getByRole("link", { name: "Edit Contributor" }).getAttribute("href")).toBe(
      "/projects/3/contributors/41/edit"
    )
  })
})
