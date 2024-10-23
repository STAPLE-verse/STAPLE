import { Role } from "db"

export type RoleTaskTableData = {
  name: string
  description: string
  rolesNames: string
  roles: Role[]
  id: number
  selectedIds: number[]
  onChangeCallback?: () => void
  onMultipledAdded?: (selectedId) => void
}

export function processRoleTaskTableData(
  tasks,
  selectedIds,
  roleChanged,
  handleMultipleChanged
): RoleTaskTableData[] {
  return tasks.map((task) => {
    const roles = task.roles || []
    return {
      name: task.name,
      description: task.description || "",
      id: task.id,
      rolesNames: roles.map((role) => role.name).join(", "),
      roles: roles,
      selectedIds: selectedIds,
      onChangeCallback: roleChanged,
      onMultipledAdded: handleMultipleChanged,
    }
  })
}
