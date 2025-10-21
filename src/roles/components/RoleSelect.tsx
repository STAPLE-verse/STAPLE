import React from "react"
import { useQuery } from "@blitzjs/rpc"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import getRoles from "src/roles/queries/getRoles"
import { RoleWithUser } from "src/core/types"
import { useForm, useFormState } from "react-final-form"

interface RoleSelectProps {
  projectManagerIds: number[]
}

const RoleSelect: React.FC<RoleSelectProps> = ({ projectManagerIds }) => {
  const [fetchedRoles] = useQuery(getRoles, {
    where: { userId: { in: projectManagerIds } },
    include: { user: true },
  })

  const roles = fetchedRoles.roles as RoleWithUser[]
  const roleOptions = roles.map((role) => ({ label: role.name, id: role.id }))
  const extraData = roles.map((role) => ({
    pm:
      role.user.firstName && role.user.lastName
        ? `${role.user.firstName} ${role.user.lastName}`
        : role.user.username || "Unknown User",
  }))

  const extraColumns = [
    {
      id: "pm",
      header: "Project Manager",
      accessorKey: "pm",
      cell: (info) => <span>{info.getValue()}</span>,
    },
  ]

  const allRoleIds = roleOptions.map((o) => o.id)
  const form = useForm()
  const { values } = useFormState()
  const allSelected =
    Array.isArray((values as any)?.rolesId) &&
    (values as any).rolesId.length === allRoleIds.length &&
    allRoleIds.length > 0

  return (
    <div className="col-span-full w-full grid grid-cols-1 gap-4">
      <div className="flex flex-col items-center mb-1">
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => form.change("rolesId", allRoleIds)}
          >
            {`Select all roles (${allRoleIds.length})`}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => form.change("rolesId", [])}
          >
            Clear
          </button>
        </div>
      </div>
      <CheckboxFieldTable
        name="rolesId"
        options={roleOptions}
        extraColumns={extraColumns}
        extraData={extraData}
      />
    </div>
  )
}

export default RoleSelect
