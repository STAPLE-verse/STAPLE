// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { LabeledSelectField } from "src/core/components/LabeledSelectField"
import getColumns from "../queries/getColumns"
import getElements from "src/elements/queries/getElements"
import { useQuery } from "@blitzjs/rpc"
import { Field, useField } from "react-final-form"

import { z } from "zod"
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
  const statusColumns = columns.map((column) => (
    <option value={column.id} key={column.id}>
      {column.name}
    </option>
  ))

  // const [elements] = useQuery(getElements, {
  //   orderBy: { id: "asc" },
  //   where: { project: { id: projectId! } },
  // })
  // const parentElements = elements.map((element) => (
  //   <option value={element.id} key={element.id}>
  //     {element.name}
  //   </option>
  // ))

  const projectInitialValues = columns && columns[0] ? columns[0].id : undefined
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
      <LabeledSelectField
        className="select select-bordered w-full max-w-xs mt-2"
        name="columnId"
        label="Status"
        // Setting the initial value to the selectinput
        initValue={projectInitialValues}
      >
        {statusColumns}
      </LabeledSelectField>
      {/* <LabeledSelectField
        className="select select-bordered w-full max-w-xs mt-2"
        name="elementId"
        label="Element"
        // Setting the initial value to the selectinput
        initValue={elementIntitialValues}
      >
        {parentElements}
      </LabeledSelectField> */}
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
