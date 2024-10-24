import React, { useState } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import { useQuery } from "@blitzjs/rpc"
import LabeledTextField from "src/core/components/fields/LabeledTextField"
import AssignTeamMembers, { TeamOption } from "./AssignTeamMembers"
import { Field } from "react-final-form"
import getContributors from "src/contributors/queries/getContributors"

interface TeamFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
  teamId?: number
  currentProjectMemberUserIds?: number[]
}

export function TeamForm<S extends z.ZodType<any, any>>(props: TeamFormProps<S>) {
  const { projectId, teamId, currentProjectMemberUserIds, ...formProps } = props

  // Get individual projectMembers only for the project
  const [contributors] = useQuery(getContributors, { projectId: projectId! })

  const allProjectMemberUserIds = contributors.map((contributor) => contributor.users[0]?.id)
  console.log("allProjectMemberUserIds", allProjectMemberUserIds)
  // Set initialValues of currentTeam projectMembers
  const currentTeamOptions = contributors.map((contributor) => {
    let checked = false
    if (teamId != undefined && currentProjectMemberUserIds != undefined) {
      checked = currentProjectMemberUserIds.includes(contributor.users[0]!.id)
    }
    return {
      // TODO: ts does not recognize prisma include class
      userName: contributor.users[0]!.username,
      userId: contributor.users[0]!.id,
      id: contributor.id,
      checked: checked,
      teamId: teamId,
    } as TeamOption
  })
  console.log("currentTeamOptions", currentTeamOptions)
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
        className="w-1/2 input mb-4 text-primary input-primary input-bordered border-2 bg-base-300"
      />
      <div className="flex justify-start mt-4">
        <Field
          name="projectMembers"
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
