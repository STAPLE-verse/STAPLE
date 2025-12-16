/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { render, screen, fireEvent } from "test/utils"
import { ShowTeamModal } from "src/teams/components/ShowTeamModal"

test("renders show team modal", async () => {
  render(<ShowTeamModal teamId={1} disabled={undefined} />)

  const openModalBtn = screen.getByTestId("open-modal")
  expect(openModalBtn).toBeInTheDocument()

  fireEvent.click(openModalBtn)
  expect(screen.getByRole("dialog")).toBeInTheDocument()

  fireEvent.click(openModalBtn)
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
})
