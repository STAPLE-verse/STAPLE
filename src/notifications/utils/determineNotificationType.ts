export function determineNotificationType(message: string): string {
  const msg = message.toLowerCase()
  if (msg.includes("assignment")) {
    return "Task"
  } else if (msg.includes("assigned")) {
    return "Task"
  } else if (msg.includes("comment")) {
    return "Comment"
  } else {
    return "Project"
  }
}
