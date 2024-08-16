import React from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import { useQuery } from "@blitzjs/rpc"
import getUsers from "src/users/queries/getUsers"
import { ContributorPrivileges } from "@prisma/client"

interface ContributorFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
  isEdit?: boolean
}

export const ContributorPrivilegesOptions = [
  { id: 0, value: ContributorPrivileges.PROJECT_MANAGER, label: "Project Manager" },
  { id: 1, value: ContributorPrivileges.CONTRIBUTOR, label: "Contributor" },
]

export function ContributorForm<S extends z.ZodType<any, any>>(props: ContributorFormProps<S>) {
  const { projectId, isEdit = false, ...formProps } = props

  const [users] = useQuery(
    getUsers,
    {
      where: {
        NOT: {
          contributions: {
            some: {
              project: {
                id: projectId,
              },
            },
          },
        },
      },
    },
    // Only run query if useers are needed for the field
    { enabled: !isEdit }
  )

  return (
    <Form<S> {...formProps}>
      {!isEdit && (
        <LabelSelectField
          className="select text-primary select-bordered w-1/2 mt-4 mb-4"
          name="userId"
          label="Select User:"
          options={users}
          optionText="username"
          optionValue="id"
        />
      )}
      <LabelSelectField
        className="select text-primary select-bordered w-1/2 mt-4"
        name="privilege"
        label="Select Privilege:"
        options={ContributorPrivilegesOptions}
        optionText="label"
        optionValue="value"
        type="string"
      />
    </Form>
  )
}
