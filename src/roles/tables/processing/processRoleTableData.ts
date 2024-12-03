export type RoleTableData = {
  name: string
  description: string
  taxonomy: string
  id: number
  userId: number
  onRolesChanged?: () => void
  taxonomyList: string[]
}

export function processRoleTableData(roles, onRolesChanged, taxonomyList): RoleTableData[] {
  return roles.map((role) => ({
    name: role.name,
    description: role.description || "",
    id: role.id,
    taxonomy: role.taxonomy || "",
    userId: role.userId,
    onRolesChanged,
    taxonomyList,
  }))
}
