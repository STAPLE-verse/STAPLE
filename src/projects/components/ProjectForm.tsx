import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/LabeledTextAreaField"

import { z } from "zod"
export { FORM_ERROR } from "src/core/components/Form"

export function ProjectForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField
        name="name"
        label="Name"
        placeholder="Name"
        type="text"
        className="mb-4 text-primary w-1/2 border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextAreaField
        className="mb-4 textarea textarea-bordered textarea-primary textarea-lg w-1/2 bg-base-300"
        name="description"
        label="Description"
        placeholder="Description"
      />
      <br />
      <LabeledTextAreaField
        className="mb-4 textarea textarea-bordered textarea-primary textarea-lg w-1/2 bg-base-300"
        name="abstract"
        label="Abstract"
        placeholder="Abstract"
      />
      <br />
      <LabeledTextField
        name="keywords"
        label="Keywords"
        placeholder="Keywords separated by commas"
        type="text"
        className="mb-4 text-primary w-1/2 border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="citation"
        label="Citation"
        placeholder="Citation"
        type="text"
        className="mb-4 text-primary w-1/2 border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="publisher"
        label="Publisher"
        placeholder="Publisher"
        type="text"
        className="mb-4 text-primary w-1/2 border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        name="identifier"
        label="Identifier"
        placeholder="Identifier: DOI, ISBN, etc."
        type="text"
        className="mb-4 text-primary w-1/2 border-primary border-2 bg-base-300"
      />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
