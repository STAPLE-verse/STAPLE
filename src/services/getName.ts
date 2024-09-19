// The function receives a ProjectMember object
// TODO: idea: incorporate getTeamName by checking projectMember.name field first (not sure if it is a good idea or not)
export function getProjectMemberName(projectMember) {
  if (projectMember && projectMember.id != null && projectMember.hasOwnProperty("user")) {
    const { firstName, lastName, username } = projectMember.user
    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }
    return username
  }

  return null
}

// This function receives a Team object
export function getTeamName(team) {
  if (team.id != null) {
    if (team.hasOwnProperty("name")) {
      return team.name
    }
  }

  return null
}
