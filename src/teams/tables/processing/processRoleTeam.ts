export type RoleTeamTableData = {
  userName: string
  name: string
  description: string
  taxonomy: string
}

export function processRoleTeam(roles): RoleTeamTableData[] {
  return roles.map((role) => {
    const { name, description, taxonomy, projectMembers } = role

    const userNames = projectMembers
      .flatMap((projectMember) => projectMember.users)
      .map((user) => (user.firstName ? `${user.firstName} ${user.lastName}` : user.username))
      .join(", ")

    return {
      name: name,
      description: description || "",
      taxonomy: taxonomy || "",
      userName: userNames,
    }
  })
}
