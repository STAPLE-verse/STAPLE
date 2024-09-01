import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"

import { z } from "zod"

export function PasswordForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField
        name="currentPassword"
        label="Old Password:"
        placeholder=""
        type="password"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="newPassword"
        label="New Password:"
        placeholder=""
        type="password"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="newPasswordRepeat"
        label="Repeat New Password:"
        placeholder=""
        type="password"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
    </Form>
  )
}
