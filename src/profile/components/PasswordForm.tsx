import { useState } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import LabeledPasswordField, {
  LabeledPassWordFieldProps,
} from "src/core/components/fields/LabeledPasswordField"

import { z } from "zod"

export function PasswordForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [currType, setType] = useState("password")
  const handlePasswordToggle = () => {
    if (currType === "password") {
      setType("text")
    } else {
      setType("password")
    }
  }

  const [currTypeV, setcurrTypeV] = useState("password")
  const handleVPasswordToggle = () => {
    if (currTypeV === "password") {
      setcurrTypeV("text")
    } else {
      setcurrTypeV("password")
    }
  }

  const [currTypeV2, setcurrTypeV2] = useState("password")
  const handleV2PasswordToggle = () => {
    if (currTypeV2 === "password") {
      setcurrTypeV2("text")
    } else {
      setcurrTypeV2("password")
    }
  }

  return (
    <Form<S> {...props}>
      <LabeledPasswordField
        name="currentPassword"
        label="Old Password:"
        placeholder=""
        type={currType as LabeledPassWordFieldProps["type"]}
        onEyeClick={handlePasswordToggle}
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300"
      />
      <br />
      <LabeledPasswordField
        name="newPassword"
        label="New Password:"
        placeholder=""
        onEyeClick={handleVPasswordToggle}
        type={currTypeV as LabeledPassWordFieldProps["type"]}
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300"
      />
      <br />
      <LabeledPasswordField
        name="newPasswordRepeat"
        label="Repeat New Password:"
        placeholder=""
        onEyeClick={handleV2PasswordToggle}
        type={currTypeV2 as LabeledPassWordFieldProps["type"]}
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300"
      />
    </Form>
  )
}
