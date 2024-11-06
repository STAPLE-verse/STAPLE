export type RoleTableData = {
  name: string
  description: string
  taxonomy: string
  id: number
  userId: number
  onChangeCallback?: () => void
  taxonomyList: string[]
}

export function processRoleTableData(roles, onChange, taxonomyList): RoleTableData[] {
  const roleChanged = async () => {
    if (onChange != undefined) {
      onChange()
    }
  }

  return roles.map((role) => {
    const name = role.name
    const description = role.description || ""
    const taxonomy = role.taxonomy || ""

    return {
      name: name,
      description: description,
      id: role.id,
      taxonomy: taxonomy,
      userId: role.userId,
      onChangeCallback: roleChanged,
      taxonomyList: taxonomyList,
    }
  })
}
