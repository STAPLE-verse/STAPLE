// Function to get the latest task log from an array of task logs based on the createdAt date
export function filterLatestTaskLog<T extends { createdAt: Date | string }>(
  logs: T[]
): T | undefined {
  if (logs.length === 0) return undefined
  return logs.reduce((latest, curr) =>
    new Date(curr.createdAt) > new Date(latest.createdAt) ? curr : latest
  )
}
