// The function receives a Contributor object
export function getContributorName(contributor) {
  if (contributor && contributor.id != null && contributor.hasOwnProperty("user")) {
    const { firstName, lastName, username } = contributor.user
    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }
    return username
  }

  return null
}

export function getTeamName(team) {
  if (team.id != null) {
    if (team.hasOwnProperty("name")) {
      return team.name
    }
  }

  return null
}
