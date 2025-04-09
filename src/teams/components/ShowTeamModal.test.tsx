/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { render, screen, fireEvent } from "test/utils"
import { ShowTeamModal } from "src/teams/components/ShowTeamModal"

test("renders show team modal", async () => {
  render(<ShowTeamModal teamId={1} disabled={undefined} />)
  expect(await screen.getByText("team1")).toBeInTheDocument()
  const openModalBtn = screen.getByTestId("open-modal")
  expect(openModalBtn).toBeInTheDocument()
  fireEvent.click(openModalBtn)
  expect(screen.getByText(/user1/i)).toBeInTheDocument()
  expect(screen.getByText(/user2/i)).toBeInTheDocument()
  expect(screen.queryByText("user3")).not.toBeInTheDocument()
  const closeModalBtn = screen.getByTestId("open-modal")
  fireEvent.click(closeModalBtn)
  expect(screen.queryByText(/user2/i)).not.toBeInTheDocument()
})
