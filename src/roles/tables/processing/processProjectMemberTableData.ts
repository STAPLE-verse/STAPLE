import { Role } from "db"

export type ProjectMemberRoleData = {
  username: string
  firstname: string
  lastname: string
  roleNames: string
  roles: Role[]
  id: number
  onChangeCallback: () => void
  selectedIds: number[]
  onMultipledAdded: (selectedId) => void
}

export function processProjectMemberTableData(
  projectMembers,
  roleChanged,
  selectedIds,
  handleMultipleChanged
): ProjectMemberRoleData[] {
  return projectMembers.map((projectMember) => {
    const roles = projectMember.roles || []
    return {
      username: projectMember.users[0].username,
      firstname: projectMember.users[0].firstName,
      lastname: projectMember.users[0].lastName,
      id: projectMember.id,
      roleNames: roles.map((role) => role.name).join(", "),
      roles: roles,
      onChangeCallback: roleChanged,
      selectedIds: selectedIds,
      onMultipledAdded: handleMultipleChanged,
    }
  })
}
