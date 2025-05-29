export const isTaskOverdue = (deadline: Date | null, status: string): boolean => {
  if (!deadline) return false
  const now = new Date()
  return new Date(deadline) < now && status !== "COMPLETED"
}
