// The function receives a ProjectMember object
export function getContributorName(projectMember) {
  if (projectMember && projectMember.id != null && projectMember.hasOwnProperty("users")) {
    if (projectMember.deleted) {
      return "Anonymous"
    }

    const { firstName, lastName, username } = projectMember.users[0]
    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }
    return username
  }

  return null
}
