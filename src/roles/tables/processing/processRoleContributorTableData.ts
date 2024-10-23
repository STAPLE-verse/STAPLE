export type RoleContributorTableData = {
  name: string
  description: string
  taxonomy: string
}

export function processRoleContributorTableData(roles): RoleContributorTableData[] {
  return roles.map((role) => {
    const { name, description, taxonomy } = role

    return {
      name: name,
      description: description || "",
      taxonomy: taxonomy || "",
    }
  })
}
