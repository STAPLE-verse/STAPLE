import React, { useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import Modal from "src/core/components/Modal"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import getRoles from "src/roles/queries/getRoles"
import { Tooltip } from "react-tooltip"
import { RoleWithUser } from "src/core/types"

interface AddRoleInputProps {
  projectManagerIds: number[]
  buttonLabel: string
}

const AddRoleInput: React.FC<AddRoleInputProps> = ({ projectManagerIds, buttonLabel }) => {
  const [openRolesModal, setRolesModal] = useState(false)
  const handleToggleRolesModal = () => setRolesModal((prev) => !prev)

  const [fetchedRoles] = useQuery(getRoles, {
    where: {
      userId: {
        in: projectManagerIds,
      },
    },
    include: {
      // projectMembers: true,
      user: true,
    },
  })

  const roles = fetchedRoles.roles as RoleWithUser[]

  const roleOptions = roles.map((role) => ({
    label: role.name,
    id: role.id,
  }))

  const extraData = roles.map((role) => ({
    pm: role.user.username,
  }))

  const extraColumns = [
    {
      id: "pm",
      header: "Project Manager",
      accessorKey: "pm",
      cell: (info) => <span>{info.getValue()}</span>,
    },
  ]

  return (
    <div>
      <Tooltip
        id="role-tooltip"
        content="Add roles to individual contributors (like administration)"
        className="z-[1099] ourtooltips"
        place="right"
        opacity={1}
      />
      <button
        type="button"
        className="btn btn-primary w-1/2"
        data-tooltip-id="role-tooltip"
        onClick={handleToggleRolesModal}
      >
        {buttonLabel}
      </button>

      <Modal open={openRolesModal} size="w-7/8 max-w-xl">
        <div>
          <div className="flex justify-start mt-4">
            <CheckboxFieldTable
              name="rolesId"
              options={roleOptions}
              extraColumns={extraColumns}
              extraData={extraData}
            />
          </div>
          <div className="modal-action flex justify-end mt-4">
            <button type="button" className="btn btn-primary" onClick={handleToggleRolesModal}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AddRoleInput
