// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { useQuery } from "@blitzjs/rpc"
import { z } from "zod"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import getLabels from "../queries/getLabels"

interface AddLabelFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId?: number
  type?: string
  tasksId?: number[]
}

export function AddLabelForm<S extends z.ZodType<any, any>>(props: AddLabelFormProps<S>) {
  const { projectId, type, tasksId, ...formProps } = props

  // need to be able to add all labels from all PMs
  const [{ labels }] = useQuery(getLabels, {
    where: {
      contributors: {
        some: {
          privilege: "PROJECT_MANAGER", // Assuming `PROJECT_MANAGER` is an enum value
          projectId: projectId,
        },
      },
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

  return (
    <Form<S> {...formProps} encType="multipart/form-data">
      <div className="flex justify-start mt-4">
        <CheckboxFieldTable name="labelsId" options={labelOptions} />
      </div>
    </Form>
  )
}
