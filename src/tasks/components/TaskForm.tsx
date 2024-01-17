// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { LabelSelectField } from "src/core/components/LabelSelectField"
import getColumns from "../queries/getColumns"
import getElements from "src/elements/queries/getElements"
import { useQuery } from "@blitzjs/rpc"
import { Field, useField } from "react-final-form"

import { z } from "zod"
import getContributors from "src/contributors/queries/getContributors"
import Modal from "src/core/components/Modal"
import { useState } from "react"

import { getDefaultSchemaLists } from "src/services/jsonconverter/getDefaultSchemaList"

//import { LabeledTextField } from "src/core/components/LabelSelectField"
// import getProjects from "src/projects/queries/getProjects"
// import { usePaginatedQuery } from "@blitzjs/rpc"
export { FORM_ERROR } from "src/core/components/Form"

// TODO: Check whether this is a good method to go
// Other methods could be: passing the columns directly
// Adding projectId directly to Form props as an optional value
interface TaskFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId?: number
  type?: string
}

export function TaskForm<S extends z.ZodType<any, any>>(props: TaskFormProps<S>) {
  const { projectId, type, ...formProps } = props

  const [columns] = useQuery(getColumns, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
  })

  const [elements] = useQuery(getElements, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
  })

  // TODO: Currently we only allow users to select from contributors already assigned to the project
  // TODO: Later on non project contributor users could be added and they will be automatically added to the project as a contributor
  const [{ contributors }] = useQuery(getContributors, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    include: {
      user: true,
    },
  })
  // TODO: User should be added to typescrit schema and the user object dropped on spread
  const contributorOptions = contributors.map((contributor) => ({
    ...contributor,
    username: contributor["user"].username,
  }))

  // const users = contributors.map((contributor) => contributor["user"])
  // const projectInitialValues = columns && columns[0] ? columns[0].id : undefined
  // const elementIntitialValues = elements && elements[0] ? elements[0].id : undefined

  const [openSchemaModal, setopenSchemaModal] = useState(false)
  const handleToggleSchemaUpload = () => {
    setopenSchemaModal((prev) => !prev)
  }

  const schemas = getDefaultSchemaLists()

  return (
    <Form<S> {...formProps} encType="multipart/form-data">
      <LabeledTextField name="name" label="Name" placeholder="Name" type="text" />

      <LabelSelectField
        className="select select-bordered w-full max-w-xs mt-2"
        name="columnId"
        label="Status"
        options={columns}
        optionText="name"
        optionValue="id"
        // Setting the initial value to the selectinput
        // initValue={projectInitialValues}
      />
      <LabeledTextField
        name="description"
        label="Description"
        placeholder="Description"
        type="text"
      />
      <LabelSelectField
        className="select select-bordered w-full max-w-xs mt-2"
        name="elementId"
        label="Parent element"
        options={elements}
        optionText="name"
        optionValue="id"
        // Setting the initial value to the selectinput
        // initValue={projectInitialValues}
      />
      <LabelSelectField
        className="select select-bordered w-full max-w-xs mt-2"
        name="contributorId"
        label="Assign a contributor"
        options={contributorOptions}
        optionText="username"
        // TODO: Fix multiple select in LabelSelectField.tsx
        multiple={false}
        optionValue="id"
        // Setting the initial value to the selectinput
        // initValue={projectInitialValues}
      />

      <div className="mt-4">
        <button type="button" className="btn" onClick={() => handleToggleSchemaUpload()}>
          Change Current Schema
        </button>

        <Modal open={openSchemaModal} size="w-11/12 max-w-3xl">
          <div className="modal-action">
            <div>
              <label>Choose a schema: </label>
              <Field name="schema" component="select">
                {schemas &&
                  schemas.map((schema) => (
                    <option key={schema.name} value={schema.name}>
                      {schema.name}
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

            {/* closes the modal */}
            <button type="button" className="btn btn-primary" onClick={handleToggleSchemaUpload}>
              Close
            </button>
          </div>
        </Modal>
      </div>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
