/**
 * @vitest-environment jsdom
 */

import { expect, vi, test } from "vitest"
import { render, screen, fireEvent } from "test/utils"
import { ShowTeamModal } from "src/assignments/components/ShowTeamModal"

test("renders show team modal", async () => {
  const curentTeam = {
    id: 1,
    name: "team1",
    contributors: [
      {
        id: 1,
        user: {
          id: 1,
          username: "user1",
        },
      },
      {
        id: 1,
        user: {
          id: 1,
          username: "user2",
        },
      },
    ],
  }

  render(<ShowTeamModal team={curentTeam}></ShowTeamModal>)

  expect(await screen.getByText("team1")).toBeInTheDocument()
  const openModalBtn = screen.getByTestId("open-modal")
  expect(openModalBtn).toBeInTheDocument()
  fireEvent.click(openModalBtn)
  expect(await screen.findByText("user1")).toBeInTheDocument()
  expect(await screen.findByText("user2")).toBeInTheDocument()
  expect(await screen.queryByText("user3")).not.toBeInTheDocument()
  const closeModalBtn = screen.getByTestId("open-modal")
  fireEvent.click(closeModalBtn)
  expect(screen.queryByText("user2")).not.toBeInTheDocument()
})
