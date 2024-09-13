/**
 * @vitest-environment jsdom
 */

import { expect, vi, test } from "vitest"
import { getByText, render } from "test/utils"
import { ShowTeamModal } from "src/assignments/components/ShowTeamModal"

vi.mock("public/logo.png", () => ({
  default: { src: "/logo.png" },
}))

test("renders show team modal", async () => {
  const curentTeam = {
    id: 1,
    name: "team1",
    contributors: [
      {
        id: 1,
      },
    ],
  }

  const { getByText } = render(<ShowTeamModal team={curentTeam}></ShowTeamModal>)
  // const linkElement = getByText(/span/)
  // expect(linkElement).toBeInTheDocument()
})
