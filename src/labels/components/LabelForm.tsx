// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"

import { Field, useField, FormSpy } from "react-final-form"

import { boolean, z } from "zod"

export { FORM_ERROR } from "src/core/components/Form"

interface LabelFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  name: string
  description: string
  taxonomy: string
}

export function LabelForm<S extends z.ZodType<any, any>>(props: LabelFormProps<S>) {
  const { ...formProps } = props
  return (
    <Form<S> {...formProps}>
      {/* Name */}
      <LabeledTextField
        className="input input-primary input-bordered w-full max-w-sm m-2"
        name="name"
        label="Label Name:"
        placeholder="Add label Name"
        type="text"
      />

      {/* Description */}
      <LabeledTextField
        className="textarea textarea-primary textarea-bordered w-full resize max-w-sm m-2"
        name="description"
        label="Label Description:"
        placeholder="Add Label Description"
        type="text"
      />
      {/* taxonomy */}
      <LabeledTextField
        className="textarea textarea-primary textarea-bordered w-full resize max-w-sm m-2"
        name="taxonomy"
        label="Taxonomy:"
        placeholder="Label taxonomy"
        type="text"
      />
    </Form>
  )
}
