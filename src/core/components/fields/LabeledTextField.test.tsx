/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { fireEvent, render, screen } from "test/utils"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import LabeledTextField from "./LabeledTextField"

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
        <LabeledTextField
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

test("renders labeled field for text type", async () => {
  const inputType = "text"
  let value = ""
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

  const elView = screen.getByTestId("labeledinput-testid")
  const input = screen.getByPlaceholderText(placeholder)
  expect(elView).toBeInTheDocument()
  expect(input).toBeInTheDocument()
  expect(screen.getByText(/input_label/i)).toBeInTheDocument()
  expect(input).not.toHaveAttribute("value", "test value")
  fireEvent.change(input, { target: { value: "test value" } })
  expect(value).equals("test value")
  expect(input).toHaveAttribute("type", inputType)
  expect(input).toHaveAttribute("name", name)
  expect(input).not.toHaveAttribute("type", "password")
})

test("renders labeled field for numeric type", async () => {
  const inputType = "number"
  let value = ""
  const onChangeHandle = (val) => {
    value = val.currentTarget.value
  }

  render(
    <MyForm
      name={name}
      placeholder={placeholder}
      onChangeCallback={onChangeHandle}
      onSubmit={(val) => {}}
      label={label}
      inputType={inputType}
    ></MyForm>
  )
  const elView = screen.getByTestId("labeledinput-testid")
  const input = screen.getByPlaceholderText(placeholder)
  expect(elView).toBeInTheDocument()
  expect(input).toBeInTheDocument()
  expect(input).not.toHaveAttribute("value", "1234567")
  fireEvent.change(input, { target: { value: "1234567a" } })
  expect(value).not.equal("1234567")
  fireEvent.change(input, { target: { value: "1234567" } })
  expect(value).equal("1234567")
  expect(input).toHaveAttribute("type", inputType)
  expect(input).not.toHaveAttribute("type", "text")
})

test("renders labeled field for password type", async () => {
  const inputType = "password"
  const testPassword = "pass"
  let value = ""
  const onChangeHandle = (val) => {
    value = val.currentTarget.value
  }

  render(
    <MyForm
      name={name}
      placeholder={placeholder}
      onChangeCallback={onChangeHandle}
      onSubmit={(val) => {}}
      label={label}
      inputType={inputType}
    ></MyForm>
  )

  const elView = screen.getByTestId("labeledinput-testid")
  const input = screen.getByPlaceholderText(placeholder)
  expect(elView).toBeInTheDocument()
  expect(input).toBeInTheDocument()
  expect(input).not.toHaveAttribute("value", testPassword)
  fireEvent.change(input, { target: { value: testPassword } })
  expect(value).equal(testPassword)
  expect(input).toHaveAttribute("type", inputType)
  expect(input).not.toHaveAttribute("type", "text")
})
