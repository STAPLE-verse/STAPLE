export type ContributorRolesListData = {
  name: string
  description: string
  taxonomy: string
}

export function processContributorRolesList(roles): ContributorRolesListData[] {
  return roles.map((role) => {
    const { name, description, taxonomy } = role

    return {
      name: name,
      description: description || "",
      taxonomy: taxonomy || "",
    }
  })
}
