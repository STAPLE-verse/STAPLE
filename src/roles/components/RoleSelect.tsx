import React from "react"
import { useQuery } from "@blitzjs/rpc"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import getRoles from "src/roles/queries/getRoles"
import { RoleWithUser } from "src/core/types"

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
  const extraData = roles.map((role) => ({ pm: role.user.username }))

  const extraColumns = [
    {
      id: "pm",
      header: "Project Manager",
      accessorKey: "pm",
      cell: (info) => <span>{info.getValue()}</span>,
    },
  ]

  return (
    <CheckboxFieldTable
      name="rolesId"
      options={roleOptions}
      extraColumns={extraColumns}
      extraData={extraData}
    />
  )
}

export default RoleSelect
