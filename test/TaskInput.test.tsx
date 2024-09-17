/**
 * @vitest-environment jsdom
 */

import { expect, vi, test } from "vitest"
import { render, screen, fireEvent } from "test/utils"
import TaskInput from "src/tasks/components/TaskInput"

test("renders task input", async () => {
  const inputType = "password"
  const placeholder = "Container placeholder"
  const name = "input 1"
  let value = ""
  const onChangeHandle = (val) => {
    value = val.currentTarget.value
  }

  render(
    <TaskInput
      type={inputType}
      name={name}
      placeholder={placeholder}
      onChange={onChangeHandle}
    ></TaskInput>
  )

  expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
  const input = screen.getByPlaceholderText(placeholder)
  fireEvent.change(input, { target: { value: "test value" } })
  expect(value).equals("test value")
})
