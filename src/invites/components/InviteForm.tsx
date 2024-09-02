// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"

import { z } from "zod"

interface InviteFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  userId?: number
}

export function InviteForm<S extends z.ZodType<any, any>>(props: InviteFormProps<S>) {
  const { userId, ...formProps } = props

  return (
    <Form<S> {...formProps}>
      {/* Name */}
      <LabeledTextField
        className="mb-4 text-primary border-primary border-2 bg-base-300"
        name="invitationCode"
        label="Invite Code:"
        placeholder="Enter your code"
        type="text"
      />
    </Form>
  )
}
