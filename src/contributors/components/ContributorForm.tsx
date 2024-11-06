import React from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import { useQuery } from "@blitzjs/rpc"
import { MemberPrivileges } from "@prisma/client"
import LabeledTextField from "src/core/components/fields/LabeledTextField"
import { Tooltip } from "react-tooltip"
import getProjectManagers from "src/projectmembers/queries/getProjectManagers"
import AddRoleInput from "src/roles/components/AddRoleInput"

interface ContributorFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
  isEdit?: boolean
  editedUserId?: number
}

export const MemberPrivilegesOptions = [
  { id: 0, value: MemberPrivileges.PROJECT_MANAGER, label: "Project Manager" },
  { id: 1, value: MemberPrivileges.CONTRIBUTOR, label: "Contributor" },
]

export function ContributorForm<S extends z.ZodType<any, any>>(props: ContributorFormProps<S>) {
  const { projectId, isEdit = false, editedUserId, ...formProps } = props

  const [projectManagers] = useQuery(getProjectManagers, {
    projectId: projectId!,
  })

  const projectManagerIds = projectManagers.map((pm) => pm.userId)

  // Check if the current user is the last project manager
  const isLastProjectManager =
    isEdit && projectManagerIds.length === 1 && projectManagerIds[0] === editedUserId

  return (
    <Form<S> {...formProps}>
      <Tooltip
        id="priv-tooltip"
        content={
          isLastProjectManager
            ? "User is the last project manager on the project. The privilege cannot be changed."
            : "Project Managers can see and edit all parts of a project, while contributors can only complete tasks assigned to them."
        }
        className="z-[1099] ourtooltips"
        place="right"
        opacity={1}
      />
      {!isEdit && (
        <LabeledTextField
          name="email"
          label="Email: (Required)"
          placeholder="Email"
          type="text"
          className="input mb-4 w-1/2 text-primary input-primary input-bordered border-2 bg-base-300"
        />
      )}
      <LabelSelectField
        className="select text-primary select-bordered border-primary border-2 w-1/2 mt-4 bg-base-300"
        name="privilege"
        label="Select Privilege: (Required)"
        options={MemberPrivilegesOptions}
        optionText="label"
        optionValue="value"
        type="string"
        data-tooltip-id="priv-tooltip"
        disabled={isLastProjectManager}
      />
      <div className="mt-4">
        <AddRoleInput
          projectManagerIds={projectManagerIds}
          buttonLabel="Add Role"
          tooltipContent="Add roles to individual contributors (like administration)"
        />
      </div>
    </Form>
  )
}
