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
      />
      <br />
      <LabeledTextAreaField
        className="textarea textarea-bordered textarea-primary textarea-lg w-1/2"
        name="description"
        label="Description"
        placeholder="Description"
        //type="textarea"
      />
      <br />
      <LabeledTextAreaField
        className="textarea textarea-bordered textarea-primary textarea-lg w-1/2"
        name="abstract"
        label="Abstract"
        placeholder="Abstract"
        //type="textarea"
      />
      <br />
      <LabeledTextField
        className="input input-bordered input-primary w-1/2"
        name="keywords"
        label="Keywords"
        placeholder="Keywords separated by commas"
        type="text"
      />
      <br />
      <LabeledTextField
        className="input input-bordered input-primary w-1/2"
        name="citation"
        label="Citation"
        placeholder="Citation"
        type="text"
      />
      <br />
      <LabeledTextField
        className="input input-bordered input-primary w-1/2"
        name="publisher"
        label="Publisher"
        placeholder="Publisher"
        type="text"
      />
      <br />
      <LabeledTextField
        className="input input-bordered input-primary w-1/2"
        name="identifier"
        label="Identifier"
        placeholder="Identifier: DOI, ISBN, etc."
        type="text"
      />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
