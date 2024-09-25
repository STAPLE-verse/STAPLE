import React, { useState } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import { useQuery } from "@blitzjs/rpc"
import { MemberPrivileges, ProjectPrivilege } from "@prisma/client"
import getRoles from "src/roles/queries/getRoles"
import Modal from "src/core/components/Modal"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import LabeledTextField from "src/core/components/fields/LabeledTextField"
import { Tooltip } from "react-tooltip"
import getProjectMembers from "../queries/getProjectMembers"
import getProjectManagers from "src/projectmembers/queries/getProjectManagers"

interface ProjectMemberFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
  isEdit?: boolean
}

export const MemberPrivilegesOptions = [
  { id: 0, value: MemberPrivileges.PROJECT_MANAGER, label: "Project Manager" },
  { id: 1, value: MemberPrivileges.CONTRIBUTOR, label: "Contributor" },
]

export function ProjectMemberForm<S extends z.ZodType<any, any>>(props: ProjectMemberFormProps<S>) {
  const { projectId, isEdit = false, ...formProps } = props

  // need all roles from all PMs for this project
  // get all roles from all PMs
  const [projectManagers] = useQuery(getProjectManagers, {
    projectId: projectId!,
  })

  const pmIds = projectManagers.map((pm) => pm.userId)
  const [{ roles }] = useQuery(getRoles, {
    where: {
      userId: {
        in: pmIds, // Filter roles where userId is in the list of PM IDs
      },
    },
    include: {
      projectMembers: true, // Optional: include projectMember data if needed
      user: true,
    },
  })
  console.log(roles)
  const roleMerged = roles.map((roles) => {
    return {
      pm: roles["user"]["username"],
      role: roles["name"],
      id: roles["id"],
    }
  })

  const extraData = roleMerged.map((item) => ({
    pm: item.pm,
  }))

  const roleOptions = roleMerged.map((item) => ({
    label: item.role,
    id: item.id,
  }))

  const extraColumns = [
    {
      id: "pm",
      header: "Project Manager",
      accessorKey: "pm",
      cell: (info) => <span>{info.getValue()}</span>,
    },
  ]

  const [openRolesModal, setrolesModal] = useState(false)
  const handleToggleRolesModal = () => {
    setrolesModal((prev) => !prev)
  }

  return (
    <Form<S> {...formProps}>
      <Tooltip
        id="priv-tooltip"
        content="Project Managers can see and edit
      all parts of a project, while contributors can only complete
      tasks assigned to them."
        className="z-[1099] ourtooltips"
        place="right"
        opacity={1}
      />
      <Tooltip
        id="role-tooltip"
        content="Add roles to individual contributors (like administration)"
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
      />
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-primary w-1/2"
          data-tooltip-id="role-tooltip"
          onClick={() => handleToggleRolesModal()}
        >
          Add Role
        </button>
        <Modal open={openRolesModal} size="w-7/8 max-w-xl">
          <div className="">
            <div className="flex justify-start mt-4">
              <CheckboxFieldTable
                name="rolesId"
                options={roleOptions}
                extraColumns={extraColumns}
                extraData={extraData}
              />
            </div>
            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button type="button" className="btn btn-primary" onClick={handleToggleRolesModal}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Form>
  )
}
