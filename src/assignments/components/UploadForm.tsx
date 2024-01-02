// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { LabelSelectField } from "src/core/components/LabelSelectField"
import { Field, useField } from "react-final-form"

import { z } from "zod"
import getContributors from "src/contributors/queries/getContributors"
//import { LabeledTextField } from "src/core/components/LabelSelectField"
// import getProjects from "src/projects/queries/getProjects"
// import { usePaginatedQuery } from "@blitzjs/rpc"
export { FORM_ERROR } from "src/core/components/Form"

// Maybe need task id to save json??
interface UploadFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  taskId?: number
  schemas?: Array<any>
}

export function UploadForm<S extends z.ZodType<any, any>>(props: UploadFormProps<S>) {
  const { taskId, schemas, ...formProps } = props

  return (
    <Form<S> {...formProps} encType="multipart/form-data">
      {/* <input type="file" className="file-input w-full max-w-xs" /> */}

      <div>
        <label>Choose an schema: </label>
        <Field name="schema" component="select">
          {schemas &&
            schemas.map((val) => (
              <option key={val.id} value={val.id}>
                {val.name}
              </option>
            ))}
        </Field>
      </div>
      <div className="mt-4">
        <label>Or upload a new one: </label>
        <Field name="files">
          {({ input: { value, onChange, ...input } }) => {
            return (
              <div>
                <input
                  onChange={({ target }) => {
                    onChange(target.files)
                  }}
                  {...input}
                  type="file"
                  className="file-input w-full max-w-xs"
                  accept=".json"
                />
              </div>
            )
          }}
        </Field>
      </div>

      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
