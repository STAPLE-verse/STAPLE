// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { useQuery } from "@blitzjs/rpc"

import { z } from "zod"

import { FORM_ERROR } from "final-form"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import getLabels from "../queries/getLabels"

interface AddLabelFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId?: number
  type?: string
  tasksId?: number[]
}

export function AddLabelForm<S extends z.ZodType<any, any>>(props: AddLabelFormProps<S>) {
  const { projectId, type, tasksId, ...formProps } = props

  const [{ labels }] = useQuery(getLabels, {
    where: { projects: { some: { id: projectId! } } },
    include: { user: true },
  })

  const labelOptions = labels.map((labels) => {
    return {
      label: labels["name"],
      id: labels["id"],
    }
  })

  return (
    <Form<S> {...formProps} encType="multipart/form-data">
      <div className="flex justify-start mt-4">
        <CheckboxFieldTable name="labelsId" options={labelOptions} />
      </div>

      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
