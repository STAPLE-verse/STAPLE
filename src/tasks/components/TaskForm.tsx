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
//import { LabeledTextField } from "src/core/components/LabelSelectField"
// import getProjects from "src/projects/queries/getProjects"
// import { usePaginatedQuery } from "@blitzjs/rpc"
export { FORM_ERROR } from "src/core/components/Form"

// TODO: Check whether this is a good method to go
// Other methods could be: passing the columns directly
// Adding projectId directly to Form props as an optional value
interface TaskFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId?: number
}

export function TaskForm<S extends z.ZodType<any, any>>(props: TaskFormProps<S>) {
  const { projectId, ...formProps } = props

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

  return (
    <Form<S> {...formProps}>
      <LabeledTextField name="name" label="Name" placeholder="Name" type="text" />
      <LabeledTextField
        name="description"
        label="Description"
        placeholder="Description"
        type="text"
      />
      <LabelSelectField
        className="select select-bordered w-full max-w-xs mt-2"
        name="columnId"
        label="Status"
        options={columns}
        optionText="name"
        // Setting the initial value to the selectinput
        // initValue={projectInitialValues}
      />
      <LabelSelectField
        className="select select-bordered w-full max-w-xs mt-2"
        name="elementId"
        label="Parent element"
        options={elements}
        optionText="name"
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
        // Setting the initial value to the selectinput
        // initValue={projectInitialValues}
      />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
