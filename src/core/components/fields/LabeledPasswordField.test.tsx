/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { fireEvent, render, screen } from "test/utils"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import { LabeledPassWordFieldProps, LabeledPasswordField } from "./LabeledPasswordField"
import { useState } from "react"

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

  const [currType, setType] = useState(inputType)
  const handlePasswordToggle = () => {
    if (currType === "password") {
      setType("text")
    } else {
      setType("password")
    }
  }

  return (
    <div>
      <Form<S> {...formProps}>
        <LabeledPasswordField
          name={name}
          label={label}
          placeholder={placeholder}
          type={currType as LabeledPassWordFieldProps["type"]}
          className="input mb-4 w-1/2 text-primary input-primary input-bordered border-2 bg-base-300"
          onChange={onChangeCallback}
          onEyeClick={handlePasswordToggle}
        />
      </Form>
    </div>
  )
}

test("renders password field for text type", async () => {
  const inputType = "password"
  let value = ""
  const expectedPass = "mypass"
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

  const elView = screen.getByTestId("labeledpassword-testid")
  const input = screen.getByTestId("inputtarget-testid")
  const eyeButton = screen.getByTestId("showpassword-testid")
  expect(elView).toBeInTheDocument()
  expect(input).toBeInTheDocument()
  expect(eyeButton).toBeInTheDocument()
  expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
  expect(screen.getByText(/input_label/i)).toBeInTheDocument()
  expect(input).toHaveAttribute("name", name)
  expect(input).not.toHaveAttribute("value", expectedPass)
  expect(input).toHaveAttribute("type", inputType)
  expect(input).not.toHaveAttribute("type", "text")
  let eyeClose = screen.queryByTestId("eyeclose-testid")
  let eyeOpen = screen.queryByTestId("eyeopen-testid")
  expect(eyeOpen).toBeInTheDocument()
  expect(eyeOpen).toHaveAttribute("aria-hidden", "true")
  expect(eyeClose).not.toBeInTheDocument()

  fireEvent.change(input, { target: { value: expectedPass } })
  expect(value).equals(expectedPass)

  fireEvent.click(eyeButton)
  expect(input).toHaveAttribute("type", "text")
  expect(input).not.toHaveAttribute("type", inputType)

  eyeClose = screen.getByTestId("eyeclose-testid")
  eyeOpen = screen.queryByTestId("eyeopen-testid")

  expect(eyeOpen).not.toBeInTheDocument()
  expect(eyeClose).toHaveAttribute("aria-hidden", "true")
  expect(eyeClose).toBeInTheDocument()
})
