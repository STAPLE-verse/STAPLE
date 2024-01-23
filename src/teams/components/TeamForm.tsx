import React, { Suspense } from "react"
import { Form, FormProps } from "src/core/components/Form"

import { z } from "zod"
import { LabelSelectField } from "src/core/components/LabelSelectField"
import { useQuery } from "@blitzjs/rpc"
import getUsers from "src/users/queries/getUsers"
import { ContributorRole } from "@prisma/client"
import LabeledTextField from "src/core/components/LabeledTextField"
import getContributors from "src/contributors/queries/getContributors"
import AssignTeamMembers, { TeamOption } from "./TeamMembersTable"
import { Field } from "react-final-form"
export { FORM_ERROR } from "src/core/components/Form"

interface TeamFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
}

export const contributorRoleOptions = [
  { id: 0, value: ContributorRole.PROJECT_MANAGER, label: "Project Manager" },
  { id: 1, value: ContributorRole.CONTRIBUTOR, label: "Contributor" },
]

export function TeamForm<S extends z.ZodType<any, any>>(props: TeamFormProps<S>) {
  const { projectId, ...formProps } = props

  const [{ contributors }] = useQuery(getContributors, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    include: {
      user: true,
    },
  })

  const currentTeamOptions = contributors.map((contributor) => {
    // let assigmentId: number | undefined = undefined
    // let index = findIdIfAssignedToTask(contributor.id)
    // if (index != -1 && taskId != undefined) {
    //   assigmentId = currentAssigments[index]?.id
    // }
    console.log(contributor)
    return {
      userName: contributor["user"].username,
      id: contributor.id,
      checked: false,
      // assigmentId: assigmentId,
    } as TeamOption
  })

  // userName: string
  // id: number
  // checked: boolean
  // teamId?: number

  console.log(contributors)

  return (
    <Form<S> {...formProps}>
      <LabeledTextField name="name" label="Name" placeholder="Name" type="text" />
      <div className="flex justify-start mt-4">
        <Field name="contributorsId">
          {({ input: { value, onChange, ...input } }) => {
            return (
              <div>
                <AssignTeamMembers
                  teamOptions={currentTeamOptions}
                  onChange={(newSelections) => {
                    console.log(newSelections)
                    // setcontributorChecked(newSelections)
                    onChange(newSelections)
                  }}
                ></AssignTeamMembers>
              </div>
            )
          }}
        </Field>
      </div>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
