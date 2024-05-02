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
        className="input input-bordered input-primary w-1/2"
        name="name"
        label="Name"
        placeholder="Name"
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextAreaField
        className="textarea textarea-bordered textarea-primary textarea-lg w-1/2"
        name="description"
        label="Description"
        placeholder="Description"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextAreaField
        className="textarea textarea-bordered textarea-primary textarea-lg w-1/2"
        name="abstract"
        label="Abstract"
        placeholder="Abstract"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        className="input input-bordered input-primary w-1/2"
        name="keywords"
        label="Keywords"
        placeholder="Keywords separated by commas"
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        className="input input-bordered input-primary w-1/2"
        name="citation"
        label="Citation"
        placeholder="Citation"
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        className="input input-bordered input-primary w-1/2"
        name="publisher"
        label="Publisher"
        placeholder="Publisher"
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <br />
      <LabeledTextField
        className="input input-bordered input-primary w-1/2"
        name="identifier"
        label="Identifier"
        placeholder="Identifier: DOI, ISBN, etc."
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
