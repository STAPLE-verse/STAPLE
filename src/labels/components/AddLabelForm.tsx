// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

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
  const { type, tasksId, ...formProps } = props
  const projectId = useParam("projectId", "number")

  const [{ labels }] = useQuery(getLabels, {
    where: {
      projects: { some: { id: { in: projectId! } } },
    },
    include: {
      user: true,
      tasks: true,
    },
  })

  const labelOptions = labels.map((labels) => {
    return {
      label: labels["name"],
      id: labels["id"],
    }
  })

  //console.log(projectId)

  return (
    <Form<S> {...formProps} encType="multipart/form-data">
      <div className="flex justify-start mt-4">
        <CheckboxFieldTable name="labelsId" options={labelOptions} />
      </div>
      {/* Note: this page has the hiccups! */}
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
