/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { render, screen } from "test/utils"
import DateFormat from "./DateFormat"

test("renders Date format", async () => {
  const dStr: string = "2024-02-27 1:45 PM"
  const expStr = "February 27, 2024 at 13:45:00"
  const ntExpStr = "01:45:00 PM"
  const date1: Date = new Date(dStr)

  render(<DateFormat date={date1}></DateFormat>)
  const dateSpan = screen.getByTestId("dateformat-id")
  expect(dateSpan).toBeInTheDocument()
  const text = await screen.getByText(expStr)
  expect(text).toBeInTheDocument()
  expect(await screen.queryByText(ntExpStr)).not.toBeInTheDocument()
})
