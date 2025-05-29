import React from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import { useQuery } from "@blitzjs/rpc"
import { MemberPrivileges } from "@prisma/client"
import LabeledTextField from "src/core/components/fields/LabeledTextField"
import AddRoleInput from "src/roles/components/AddRoleInput"
import getProjectManagerUserIds from "src/projectmembers/queries/getProjectManagerUserIds"
import TooltipWrapper from "src/core/components/TooltipWrapper"
import CollapseCard from "src/core/components/CollapseCard"

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

  const [projectManagerUserIds] = useQuery(getProjectManagerUserIds, {
    projectId: projectId!,
  })

  // Check if the current user is the last project manager
  const isLastProjectManager =
    isEdit && projectManagerUserIds.length === 1 && projectManagerUserIds[0] === editedUserId

  return (
    <Form<S> {...formProps}>
      <CollapseCard title="Edit Contributor Settings" defaultOpen={true}>
        <TooltipWrapper
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
            label="Email:"
            placeholder="Email"
            type="text"
            className="input mb-4 w-1/2 text-primary input-primary input-bordered border-2 bg-base-300"
          />
        )}
        <LabelSelectField
          className="select text-primary select-bordered border-primary border-2 w-1/2 mb-4 w-1/2"
          name="privilege"
          label="Select Privilege:"
          options={MemberPrivilegesOptions}
          optionText="label"
          optionValue="value"
          type="string"
          data-tooltip-id="priv-tooltip"
          disabled={isLastProjectManager}
        />

        <AddRoleInput
          projectManagerIds={projectManagerUserIds}
          buttonLabel="Add Role"
          tooltipContent="Add role labels"
        />
      </CollapseCard>
    </Form>
  )
}
