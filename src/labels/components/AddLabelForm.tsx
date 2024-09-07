// import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { useQuery } from "@blitzjs/rpc"
import { z } from "zod"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import getLabels from "../queries/getLabels"
import getContributors from "src/contributors/queries/getContributors"

interface AddLabelFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId?: number
  type?: string
  tasksId?: number[]
}

export function AddLabelForm<S extends z.ZodType<any, any>>(props: AddLabelFormProps<S>) {
  const { projectId, type, tasksId, ...formProps } = props

  // Contributors
  const [{ contributors }] = useQuery(getContributors, {
    where: { project: { id: projectId! } },
    include: {
      user: true,
    },
  })
  // get all labels from all PMs
  const projectManagers = contributors.filter(
    (contributor) => contributor.privilege === "PROJECT_MANAGER"
  )
  const pmIds = projectManagers.map((pm) => pm.userId)
  console.log(pmIds)
  const [{ labels }] = useQuery(getLabels, {
    where: {
      userId: {
        in: pmIds, // Filter labels where userId is in the list of PM IDs
      },
    },
    include: {
      contributors: true, // Optional: include contributor data if needed
      tasks: true,
      user: true,
    },
  })

  // Assuming `labels` is an array of objects
  const labelMerged = labels.map((label) => {
    return {
      pm: label["user"]["username"], // Accessing the nested username
      label: label.name,
      id: label.id,
    }
  })

  // Use the mapped array directly
  const extraData = labelMerged.map((item) => ({
    pm: item.pm,
  }))

  const labelOptions = labelMerged.map((item) => ({
    label: item.label,
    id: item.id,
  }))

  const extraColumns = [
    {
      id: "pm",
      header: "Project Manager",
      accessorKey: "pm",
      cell: (info) => <span>{info.getValue()}</span>,
    },
  ]

  return (
    <Form<S> {...formProps} encType="multipart/form-data">
      <div className="flex justify-start mt-4">
        <CheckboxFieldTable
          name="labelsId"
          options={labelOptions}
          extraColumns={extraColumns}
          extraData={extraData}
        />
      </div>
    </Form>
  )
}
