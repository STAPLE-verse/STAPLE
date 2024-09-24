import React, { useState } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import { useQuery } from "@blitzjs/rpc"
import { MemberPrivileges, ProjectMember, User } from "@prisma/client"
import LabeledTextField from "src/core/components/fields/LabeledTextField"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import AssignTeamMembers, { TeamOption } from "./AssignTeamMembers"
import { Field } from "react-final-form"
import { ProjectMemberWithUsers } from "src/pages/projects/[projectId]/teams"

interface TeamFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
  teamId?: number
  currentProjectMemberIds?: number[]
}

export const MemberPrivilegesOptions = [
  { id: 0, value: MemberPrivileges.PROJECT_MANAGER, label: "Project Manager" },
  { id: 1, value: MemberPrivileges.CONTRIBUTOR, label: "Contributor" },
]

export function TeamForm<S extends z.ZodType<any, any>>(props: TeamFormProps<S>) {
  const { projectId, teamId, currentProjectMemberIds, ...formProps } = props

  // Get individual projectMembers only for the project
  const [{ projectMembers }] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      name: { not: null }, // Ensures the name in ProjectMember is non-null
      users: {
        some: { id: { not: undefined } }, // Ensures there's at least one user
      },
    },
    orderBy: { id: "asc" },
    include: {
      users: true,
    },
  })

  // Set initialValues of currentTeam projectMembers
  const currentTeamOptions = projectMembers.map((projectMember) => {
    let checked = false
    if (teamId != undefined && currentProjectMemberIds != undefined) {
      checked = currentProjectMemberIds.find((id) => id == projectMember.id) != undefined
    }
    return {
      // TODO: ts does not recognize prisma include class
      userName: projectMember.users[0].username,
      userId: projectMember.users[0].id,
      id: projectMember.id,
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
