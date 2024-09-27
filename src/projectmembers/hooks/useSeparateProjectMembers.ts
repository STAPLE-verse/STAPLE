import { useMemo } from "react"
import { ProjectMemberWithTaskLog } from "src/tasks/components/TaskContext"

// Hook to separate project members into individual and team based on the number of referenced users
export function useSeparateProjectMembers(projectMembers: ProjectMemberWithTaskLog[]) {
  // Use useMemo to avoid recalculating on every render
  const { individualProjectMembers, teamProjectMembers } = useMemo(() => {
    const individualProjectMembers: ProjectMemberWithTaskLog[] = []
    const teamProjectMembers: ProjectMemberWithTaskLog[] = []

    // Iterate through the project members and separate them based on
    // team name being null since teams can be one person
    projectMembers.forEach((member) => {
      if (member.name === null) {
        individualProjectMembers.push(member)
      } else {
        teamProjectMembers.push(member)
      }
    })

    return { individualProjectMembers, teamProjectMembers }
  }, [projectMembers])

  return { individualProjectMembers, teamProjectMembers }
}
