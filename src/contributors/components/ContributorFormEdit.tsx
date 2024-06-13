import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"

import { z } from "zod"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import { useQuery } from "@blitzjs/rpc"
import getUsers from "src/users/queries/getUsers"
import { ContributorPrivileges } from "@prisma/client"
export { FORM_ERROR } from "src/core/components/fields/Form"

interface ContributorFormEditProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
}

export const ContributorPrivilegesOptions = [
  { id: 0, value: ContributorPrivileges.PROJECT_MANAGER, label: "Project Manager" },
  { id: 1, value: ContributorPrivileges.CONTRIBUTOR, label: "Contributor" },
]

export function ContributorFormEdit<S extends z.ZodType<any, any>>(
  props: ContributorFormEditProps<S>
) {
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
        className="select text-primary select-bordered w-1/2 mt-4"
        name="privilege"
        label="Select Privilege:"
        options={ContributorPrivilegesOptions}
        optionText="label"
        optionValue="id"
      />
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
