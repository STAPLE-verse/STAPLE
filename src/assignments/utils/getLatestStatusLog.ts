// Utility function to get the latest log from status logs
export const getLatestStatusLog = (logs) => {
  if (!logs || !Array.isArray(logs)) {
    return null // or handle the case where logs is not an array
  }

  return (
    logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ||
    null
  )
}
