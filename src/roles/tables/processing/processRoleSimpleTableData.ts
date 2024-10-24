export type RoleSimpleTableData = {
  name: string
  description: string
  taxonomy: string
}

export function processRoleSimpleTableData(roles): RoleSimpleTableData[] {
  return roles.map((role) => {
    const { name, description, taxonomy } = role

    return {
      name: name,
      description: description || "",
      taxonomy: taxonomy || "",
    }
  })
}
