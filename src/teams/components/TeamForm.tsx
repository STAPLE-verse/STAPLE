import React, { Suspense, useState } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import { useQuery } from "@blitzjs/rpc"
import { ContributorPrivileges } from "@prisma/client"
import LabeledTextField from "src/core/components/fields/LabeledTextField"
import getContributors from "src/contributors/queries/getContributors"
import AssignTeamMembers, { TeamOption } from "./TeamMembersTable"
import { Field } from "react-final-form"
import { FORM_ERROR } from "final-form"

interface TeamFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
  teamId?: number
  currentContributorsId?: number[]
}

export const ContributorPrivilegesOptions = [
  { id: 0, value: ContributorPrivileges.PROJECT_MANAGER, label: "Project Manager" },
  { id: 1, value: ContributorPrivileges.CONTRIBUTOR, label: "Contributor" },
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

  const [validAssignments, setValidAssignments] = useState(true)
  const areAssignmentValid = (values) => {
    if (values != undefined && values.findIndex((el) => el.checked) >= 0) {
      return true
    }
    return false
  }

  return (
    <Form<S> {...formProps}>
      <LabeledTextField
        name="name"
        label="Team Name: (Required)"
        placeholder="Team Name"
        type="text"
        className="mb-4 text-primary border-primary border-2 bg-base-300"
      />
      <div className="flex justify-start mt-4">
        <Field
          name="contributorsId"
          initialValue={currentTeamOptions}
          validate={(values) => {
            let t = areAssignmentValid(values)
            setValidAssignments(t)
            return !t
          }}
        >
          {({ input: { value, onChange, ...input } }) => {
            return (
              <div>
                <div className="flex justify-start mt-1">
                  {validAssignments ? (
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
