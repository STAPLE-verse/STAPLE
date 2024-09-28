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
    projectMembers: [],
    createdAt: new Date(createdAtStr),
  }
  return team
}

test("renders basic Utils/Team view ", async () => {
  const team = getBasicTeam()
  const { debug } = render(<TeamView team={team} tasks={[]} printTask={true}></TeamView>)
  debug()
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

// test("renders basic Utils/Team view  with task and members  ", async () => {

// })
