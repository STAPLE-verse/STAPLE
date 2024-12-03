export const getPrivilegeText = (privilege): string => {
  switch (privilege) {
    case "PROJECT_MANAGER":
      return "Project Manager"
    case "CONTRIBUTOR":
      return "Contributor"
    default:
      return "Unknown Privilege"
  }
}
