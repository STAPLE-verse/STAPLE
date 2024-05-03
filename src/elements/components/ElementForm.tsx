import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/LabeledTextAreaField"

import { z } from "zod"
export { FORM_ERROR } from "src/core/components/Form"

export function ElementForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField
        name="name"
        label="Name"
        placeholder="Name"
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <LabeledTextAreaField
        name="description"
        label="Description"
        placeholder="Description"
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
