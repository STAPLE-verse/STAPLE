import React, { Suspense, useState } from "react"
import { Form, FormProps } from "src/core/components/Form"
import { z } from "zod"
import { useQuery } from "@blitzjs/rpc"
import { ContributorRole } from "@prisma/client"
import LabeledTextField from "src/core/components/LabeledTextField"
import getContributors from "src/contributors/queries/getContributors"
import AssignTeamMembers, { TeamOption } from "./TeamMembersTable"
import { Field } from "react-final-form"
export { FORM_ERROR } from "src/core/components/Form"

interface TeamFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
  teamId?: number
  currentContributorsId?: number[]
}

export const contributorRoleOptions = [
  { id: 0, value: ContributorRole.PROJECT_MANAGER, label: "Project Manager" },
  { id: 1, value: ContributorRole.CONTRIBUTOR, label: "Contributor" },
]

export function TeamForm<S extends z.ZodType<any, any>>(props: TeamFormProps<S>) {
  const { projectId, teamId, currentContributorsId, ...formProps } = props

  const [{ contributors }] = useQuery(getContributors, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    include: {
      user: true,
    },
  })

  const currentTeamOptions = contributors.map((contributor) => {
    let checked = false
    if (teamId != undefined && currentContributorsId != undefined) {
      checked = currentContributorsId.find((id) => id == contributor.id) != undefined
    }
    return {
      userName: contributor["user"].username,
      id: contributor.id,
      checked: checked,
      teamId: teamId,
    } as TeamOption
  })

  const [validAssigments, setValidAssigments] = useState(true)
  const areAssigmentValid = (values) => {
    if (values != undefined && values.findIndex((el) => el.checked) >= 0) {
      return true
    }
    return false
  }

  return (
    <Form<S> {...formProps}>
      <LabeledTextField name="name" label="Name" placeholder="Name" type="text" />
      <div className="flex justify-start mt-4">
        <Field
          name="contributorsId"
          initialValue={currentTeamOptions}
          validate={(values) => {
            let t = areAssigmentValid(values)
            setValidAssigments(t)
            return !t
          }}
        >
          {({ input: { value, onChange, ...input } }) => {
            return (
              <div>
                <div className="flex justify-start mt-1">
                  {validAssigments ? (
                    ""
                  ) : (
                    <span className="text-error">Needs a least one member</span>
                  )}
                </div>
                <div>
                  <AssignTeamMembers
                    showCheckbox={true}
                    teamOptions={currentTeamOptions}
                    onChange={(newSelections) => {
                      onChange(newSelections)
                    }}
                  ></AssignTeamMembers>
                </div>
              </div>
            )
          }}
        </Field>
      </div>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
    </Form>
  )
}
