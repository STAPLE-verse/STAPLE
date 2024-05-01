export const getAssignmentStatusText = (status): string => {
  switch (status) {
    case "COMPLETED":
      return "Completed"
    case "NOT_COMPLETED":
      return "Not completed"
    default:
      return "Unknown status"
  }
}
