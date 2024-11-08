/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { fireEvent, render, screen } from "test/utils"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import LabeledTextAreaField from "./LabeledTextAreaField"

interface MyFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  name: string
  placeholder: string
  label: string
  inputType?: "text" | "password" | "email" | "number" | "textarea"
  onChangeCallback: (val) => void
}

const placeholder = "Container placeholder"
const name = "input 1"
const label = "input_label"

function MyForm<S extends z.ZodType<any, any>>(props: MyFormProps<S>) {
  const { name, placeholder, inputType, onChangeCallback, label, ...formProps } = props

  return (
    <div>
      <Form {...formProps}>
        <LabeledTextAreaField
          name={name}
          label={label}
          placeholder={placeholder}
          type={inputType}
          className="input mb-4 w-1/2 text-primary input-primary input-bordered border-2 bg-base-300"
          onChange={onChangeCallback}
        />
      </Form>
    </div>
  )
}

test("renders text area field", async () => {
  const inputType = "text"
  let value = ""
  const expectedValue = `
   Test string with multilne
   second line ....
   last line /`
  const onChangeHandle = (val) => {
    value = val.currentTarget.value
  }

  render(
    <MyForm
      name={name}
      placeholder={placeholder}
      onChangeCallback={onChangeHandle}
      onSubmit={(val) => {}}
      inputType={inputType}
      label={label}
    ></MyForm>
  )

  const elView = screen.getByTestId("labeledarea-testid")
  const input = screen.getByTestId("labeledtarget-testid")
  expect(elView).toBeInTheDocument()
  expect(input).toBeInTheDocument()
  expect(screen.getByText(/input_label/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
  expect(input).toHaveAttribute("name", name)
  expect(input).toHaveAttribute("type", inputType)
  expect(input).not.toHaveAttribute("type", "password")
  expect(input).not.toHaveAttribute("value", expectedValue)
  fireEvent.change(input, { target: { value: expectedValue } })
  expect(value).equals(expectedValue)

  let lines = expectedValue.split(/\r?\n|\r|\n/g)
  expect(lines.length).equals(4)
})
