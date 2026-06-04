export function cleanProjectData(project: any) {
  const deletedMemberIds = new Set(
    project.projectMembers.filter((member: any) => member.deleted).map((member: any) => member.id)
  )

  // Anonymize user info for deleted members, using unique suffixes
  let deletedCounter = 1
  project.projectMembers = project.projectMembers.map((member: any) => {
    if (member.deleted) {
      const suffix = `deleted_${deletedCounter++}`
      return {
        ...member,
        users: [
          {
            institution: suffix,
            username: suffix,
            firstName: suffix,
            lastName: suffix,
            email: suffix,
          },
        ],
      }
    }
    return member
  })

  // Scrub task fields based on anonymous flags
  if (Array.isArray(project.tasks)) {
    project.tasks = project.tasks.map((task: any) => {
      if (!task) return task
      const scrubbed: any = { ...task }
      if (task.anonymous) {
        scrubbed.name = "Anonymous task"
        scrubbed.description = "Anonymous task"
      }
      if (task.anonymousResponses) {
        scrubbed.taskLogs = Array.isArray(task.taskLogs)
          ? task.taskLogs.map((log: any) => ({ ...log, metadata: null }))
          : task.taskLogs
      }
      return scrubbed
    })
  }

  // Keep all task/user references as-is
  return project
}
