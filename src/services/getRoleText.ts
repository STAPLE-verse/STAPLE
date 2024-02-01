export const getRoleText = (role): string => {
  switch (role) {
    case "PROJECT_MANAGER":
      return "Project Manager"
    case "CONTRIBUTOR":
      return "Contributor"
    default:
      return "Unknown Role"
  }
}
