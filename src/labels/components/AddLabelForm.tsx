// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { useQuery } from "@blitzjs/rpc"

import { z } from "zod"
import getContributors from "src/contributors/queries/getContributors"

import { useState } from "react"
import getTeams from "src/teams/queries/getTeams"
export { FORM_ERROR } from "src/core/components/Form"
import CheckboxFieldTable from "src/core/components/CheckboxFieldTable"
import getLabels from "../queries/getLabels"

interface AddLabelFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId?: number
  type?: string
  tasksId?: number[]
}

export function AddLabelForm<S extends z.ZodType<any, any>>(props: AddLabelFormProps<S>) {
  const { projectId, type, tasksId, ...formProps } = props

  const [{ labels }] = useQuery(getLabels, {
    // where: { project: { id: projectId! } },
    // include: {
    //   user: true,
    // },
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
