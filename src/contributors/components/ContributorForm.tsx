import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"

import { z } from "zod"
import { LabelSelectField } from "src/core/components/LabelSelectField"
import { useQuery } from "@blitzjs/rpc"
import getUsers from "src/users/queries/getUsers"
import { ContributorRole } from "@prisma/client"
export { FORM_ERROR } from "src/core/components/Form"

interface ContributorFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
}

export const contributorRoleOptions = [
  { id: 0, value: ContributorRole.PROJECT_MANAGER, label: "Project Manager" },
  { id: 1, value: ContributorRole.CONTRIBUTOR, label: "Contributor" },
]

export function ContributorForm<S extends z.ZodType<any, any>>(props: ContributorFormProps<S>) {
  const { projectId, ...formProps } = props

  const [users] = useQuery(getUsers, {
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
  })

  return (
    <Form<S> {...formProps}>
      <LabelSelectField
        className="select select-bordered w-full max-w-xs mt-2"
        name="userId"
        label="Select User"
        options={users}
        optionText="username"
        optionValue="id"
      />
      <LabelSelectField
        className="select select-bordered w-full max-w-xs mt-2"
        name="role"
        label="Select Role"
        options={contributorRoleOptions}
        optionText="label"
        optionValue="id"
      />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
