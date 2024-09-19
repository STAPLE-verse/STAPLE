import { useMemo } from "react"
import { ProjectMemberWithTaskLog } from "src/tasks/components/TaskContext"

// Hook to separate project members into individual and team based on the number of referenced users
export function useSeparateProjectMembers(projectMembers: ProjectMemberWithTaskLog[]) {
  // Use useMemo to avoid recalculating on every render
  const { individualProjectMembers, teamProjectMembers } = useMemo(() => {
    const individualProjectMembers: ProjectMemberWithTaskLog[] = []
    const teamProjectMembers: ProjectMemberWithTaskLog[] = []

    // Iterate through the project members and separate them based on the number of users
    projectMembers.forEach((member) => {
      if (member.users.length === 1) {
        individualProjectMembers.push(member)
      } else {
        teamProjectMembers.push(member)
      }
    })

    return { individualProjectMembers, teamProjectMembers }
  }, [projectMembers])

  return { individualProjectMembers, teamProjectMembers }
}
