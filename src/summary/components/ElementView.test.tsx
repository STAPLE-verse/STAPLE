/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { render, screen } from "test/utils"
import { ElementView } from "./UtilsViews"

test("renders Utils/Element view", async () => {
  const element1 = {
    name: "element1",
    description: "a element test ",
  }

  render(<ElementView element={element1} task={undefined} printTask={false}></ElementView>)

  const elView = screen.getByTestId("elementview-testid")
  expect(elView).toBeInTheDocument()
  expect(screen.getByRole("heading", { name: /element name: element1/i })).toBeInTheDocument()
  expect(screen.getByText(/description: a element test/i)).toBeInTheDocument()
  expect(screen.queryByText("This task does not have element")).not.toBeInTheDocument()

  render(<ElementView element={element1} task={undefined} printTask={true}></ElementView>)
  expect(
    screen.getByRole("heading", { name: /the element does not have a task/i })
  ).toBeInTheDocument()
})
