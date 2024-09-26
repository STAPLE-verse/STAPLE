/**
 * @vitest-environment jsdom
 */

import { expect, vi, test } from "vitest"
import { render, screen, fireEvent } from "test/utils"
import DateField from "./DateField"
import { Form, FormProps } from "./Form"
import { z } from "zod"

interface MyFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  name: string
  placeholder: string
  label: string
  onChangeCallback: (val) => void
}

function MyForm<S extends z.ZodType<any, any>>(props: MyFormProps<S>) {
  const { name, placeholder, onChangeCallback, label, ...formProps } = props

  return (
    <div>
      <Form {...formProps}>
        <DateField
          name={name}
          placeholder={placeholder}
          onChange={(val) => {
            console.log("what")
            onChangeCallback(val)
          }}
          label={label}
        ></DateField>
      </Form>
    </div>
  )
}

test("renders date field", async () => {
  const placeholder = "Enter date"
  const name = "A date field"
  const label = "My deadline"
  const onChangeHandle = (val) => {}

  render(
    <MyForm
      name={name}
      placeholder={placeholder}
      onChangeCallback={onChangeHandle}
      onSubmit={(val) => {}}
      label={label}
    ></MyForm>
  )

  expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
  expect(await screen.findByText(label)).toBeInTheDocument()
  expect(screen.getByText(/my deadline/i)).toBeInTheDocument()
  const inputField = screen.getByTestId("datefield-input")
  expect(inputField).toBeInTheDocument()
  expect(screen.queryByText(/A date field/i)).not.toBeInTheDocument()
})
