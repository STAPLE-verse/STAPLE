/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { render, screen } from "test/utils"
import { TeamView } from "./UtilsViews"

const getBasicTeam = () => {
  const createdAtStr: string = "2024-10-29 02:45 PM"
  const team = {
    id: 1,
    name: "team1",
    projectMembers: [] as any,
    createdAt: new Date(createdAtStr),
  }
  return team
}

const getTeamWithMembers = () => {
  const team = getBasicTeam()
  const members = [
    {
      id: 1,
      user: {
        id: 1,
        firstName: "user1First",
        lastName: "user1Last",
      },
    },
    {
      id: 2,
      user: {
        id: 2,
        firstName: "user2First",
        lastName: "user2Last",
      },
    },
  ]
  team.projectMembers = members

  return team
}

test("renders basic Utils/Team view ", async () => {
  const team = getBasicTeam()
  render(<TeamView team={team} tasks={[]} printTask={true}></TeamView>)

  const elView = screen.getByTestId("teamview-testid")
  expect(elView).toBeInTheDocument()
  expect(
    screen.getByRole("heading", {
      name: /name: team1/i,
    })
  )
  expect(screen.getByRole("heading", { name: /members/i })).toBeInTheDocument()
  expect(
    screen.getByRole("heading", {
      name: /this team does not have completed assignments/i,
    })
  ).toBeInTheDocument()
  expect(screen.getByText(/october 29, 2024 at 14:45:00/i)).toBeInTheDocument()

  expect(
    screen.queryByRole("heading", {
      name: /Tasks with completed assignments/i,
    })
  ).not.toBeInTheDocument()
})

test("renders basic Utils/Team view  with members  ", async () => {
  const team = getTeamWithMembers()
  const { debug } = render(<TeamView team={team} tasks={[]} printTask={false}></TeamView>)
  debug()

  const elView = screen.getByTestId("teamview-testid")
  expect(elView).toBeInTheDocument()
  expect(screen.getByText(/name: user1first user1last/i)).toBeInTheDocument()
  expect(screen.getByText(/name: user2first user2last/i)).toBeInTheDocument()
  expect(screen.queryByText(/name: user3first user3last/i)).not.toBeInTheDocument()
  expect(
    screen.queryByRole("heading", {
      name: /this team does not have completed assignments/i,
    })
  ).not.toBeInTheDocument()
})
