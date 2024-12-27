import React from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/fields/LabeledTextAreaField"
import { z } from "zod"
import ProjectSchemaInput from "./ProjectSchemaInput"

interface ProjectFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  formResponseSupplied?: boolean
  userId: number
}

export function ProjectForm<S extends z.ZodType<any, any>>(props: ProjectFormProps<S>) {
  const { formResponseSupplied = true, userId, ...formProps } = props
  return (
    <Form<S> {...formProps} encType="multipart/form-data">
      <LabeledTextField
        name="name"
        label="Name: (Required)"
        placeholder="Name"
        type="text"
        className="input mb-4 w-1/2 text-primary input-primary input-bordered border-2 bg-base-300"
      />
      <br />
      <LabeledTextAreaField
        className="mb-4 textarea text-primary textarea-bordered textarea-primary textarea-lg w-1/2 bg-base-300 border-2"
        name="description"
        label="Description:"
        placeholder="Description"
      />

      <ProjectSchemaInput userId={userId} />

      {formResponseSupplied ? (
        <div className="mt-4">
          <p className="w-1/2 text-red-500">
            You have previously selected a form to describe this project. If you change forms, you
            will lose your previously saved information. Download the previously stored data first
            as a backup!
          </p>
          <button>download</button>
        </div>
      ) : (
        // add button to download here

        // add the default button if not selected
        <button>default</button>
      )}
    </Form>
  )
}
