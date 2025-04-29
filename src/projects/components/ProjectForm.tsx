import React, { useState } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { LabeledTextAreaField } from "src/core/components/fields/LabeledTextAreaField"
import { z } from "zod"
import ProjectSchemaInput from "./ProjectSchemaInput"
import CollapseCard from "src/core/components/CollapseCard"

interface ProjectFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  formResponseSupplied?: boolean
  userId: number
  initialValues?: {
    selectedFormVersionId?: number | null
    [key: string]: any // Allows flexibility for additional form values
  }
}

export function ProjectForm<S extends z.ZodType<any, any>>(props: ProjectFormProps<S>) {
  const {
    formResponseSupplied = true,
    userId,
    initialValues = { selectedFormVersionId: null }, // Default value for new projects
    ...formProps
  } = props

  const [formVersionId, setFormVersionId] = useState<number | null>(
    initialValues.selectedFormVersionId ?? null // Use null if undefined
  )

  //console.log("Current formVersionId:", formVersionId)
  //console.log("Initial values:", initialValues)

  // Callback to handle default form creation
  const handleDefaultFormCreated = (newFormVersionId: number) => {
    //console.log("Default form version created with ID:", newFormVersionId)
    setFormVersionId(newFormVersionId) // Update state with the new form version ID
  }

  // Override onSubmit to include formVersionId
  const handleSubmit = async (values: S, form: any, callback?: any) => {
    const updatedValues = { ...values, formVersionId } // Add formVersionId to the submission
    //console.log("Submitting form with values:", updatedValues)

    // Call the original onSubmit passed via props with all required arguments
    if (formProps.onSubmit) {
      await formProps.onSubmit(updatedValues, form, callback)
    }
  }

  return (
    <Form<S>
      {...formProps}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <CollapseCard title="Edit Name and Description" className="mb-4">
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
      </CollapseCard>

      <CollapseCard title="Edit Project Required Form" className="">
        {formResponseSupplied ? (
          <div className="mt-4">
            <p className="w-1/2 text-lg">
              You have previously selected a form to describe this project. If you change to a new
              form, you will retain the old information, and it will be transferred to the new form
              as long as the object names (question labels) match. The non-matches are kept in the
              background, and if you want to clear it out, please reset the form data under Edit
              Form.
            </p>
          </div>
        ) : (
          <div className="mt-4 w-1/2">
            <p className="text-lg">
              Add project details by adding a form. Not sure where to start? Click Add Form and
              select the default. You can change this later under settings.
            </p>
          </div>
        )}

        <ProjectSchemaInput
          userId={userId}
          onDefaultFormCreated={handleDefaultFormCreated}
          selectedFormVersionId={formVersionId ?? null}
        />
      </CollapseCard>
    </Form>
  )
}
