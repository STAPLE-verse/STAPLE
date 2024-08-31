import React from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/fields/LabeledTextAreaField"

import { z } from "zod"

export function ElementForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField
        name="name"
        label="Name: (Required)"
        placeholder="Name"
        type="text"
        className="mb-4 w-1/2 text-primary border-primary border-2 bg-base-300"
      />
      <LabeledTextAreaField
        name="description"
        label="Description:"
        placeholder="Description"
        type="text"
        className="mb-4 w-1/2 textarea text-primary textarea-bordered textarea-primary textarea-lg bg-base-300 border-2"
      />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
