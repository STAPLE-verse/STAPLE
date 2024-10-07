/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { render, screen } from "test/utils"
import { ProjectMembersView } from "./UtilsViews"
const getProjectMember = () => {
  const createdAtStr: string = "2024-10-30 01:30 AM"
  const member = {
    id: 1,
    users: {
      id: 1,
      firstName: "user1First",
      lastName: "user1Last",
    },
    roles: [] as any,
    createdAt: new Date(createdAtStr),
  }
  return member
}

const getProjectmemberWithRoles = () => {
  const member = getProjectMember()
  const roles = [
    {
      id: 1,
      name: "admin",
    },
    {
      id: 2,
      name: "dev",
    },
  ]
  member.roles = roles
  return member
}

test("renders basic Utils/ProjectMembers view ", async () => {
  const team = getProjectMember()
  render(<ProjectMembersView projectMember={team} tasks={[]} printTask={true}></ProjectMembersView>)

  const elView = screen.getByTestId("projectmemberview-testid")
  expect(elView).toBeInTheDocument()
  expect(
    screen.getByRole("heading", {
      name: /name: user1first user1last/i,
    })
  )
  expect(screen.getByText(/added to project:/i)).toBeInTheDocument()
  expect(screen.getByText(/october 30, 2024 at 01:30:00/i)).toBeInTheDocument()
  expect(
    screen.getByRole("heading", {
      name: /this contributor does not have completed assignments/i,
    })
  ).toBeInTheDocument()

  expect(
    screen.queryByRole("heading", {
      name: /this contributor does not have roles/i,
    })
  ).not.toBeInTheDocument()
})

test("renders basic Utils/ProjectMember view  with roles  ", async () => {
  const member = getProjectmemberWithRoles()
  render(
    <ProjectMembersView
      projectMember={member}
      tasks={[]}
      printTask={false}
      printRoles={true}
    ></ProjectMembersView>
  )

  const elView = screen.getByTestId("projectmemberview-testid")
  expect(elView).toBeInTheDocument()

  expect(screen.getByText(/contribution categories:/i)).toBeInTheDocument()
  expect(screen.getByText(/admin/i)).toBeInTheDocument()
  expect(screen.getByText(/dev/i)).toBeInTheDocument()
  expect(screen.queryByText(/manager/i)).not.toBeInTheDocument()
  expect(
    screen.queryByRole("heading", {
      name: /this contributor does not have completed assignments/i,
    })
  ).not.toBeInTheDocument()
})
