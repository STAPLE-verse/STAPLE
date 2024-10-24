export function getCommonRoles(contributors) {
  const rolesArrays = contributors.map((contributor) => contributor.roles)
  if (rolesArrays.length === 0) return []

  // Find roles that are common to all selected contributor
  return rolesArrays.reduce((commonRoles, roles) => {
    return commonRoles.filter((role) => roles.some((r) => r.id === role.id))
  }, rolesArrays[0]) // Start with the roles of the first contributor
}
