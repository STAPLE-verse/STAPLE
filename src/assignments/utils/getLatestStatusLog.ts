// Utility function to get the latest log from status logs
export const getLatestStatusLog = (logs) => {
  return (
    logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ||
    null
  )
}
