/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { render, screen } from "test/utils"
import DateFormat from "./DateFormat"

test("renders Date format", async () => {
  const dStr: string = "2024-02-27 1:45 PM"
  const expStr = "February 27, 2024 at 13:45"
  const date1: Date = new Date(dStr)

  render(<DateFormat date={date1} />)

  expect(await screen.getByText(expStr)).toBeInTheDocument()
})
