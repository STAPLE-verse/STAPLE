import { useMemo } from "react"

// Generic hook to separate project members into individual and team based on a condition
export function useSeparateProjectMembers<T extends { name: string | null }>(projectMembers: T[]) {
  // Use useMemo to avoid recalculating on every render
  const { individualProjectMembers, teamProjectMembers } = useMemo(() => {
    const individualProjectMembers: T[] = []
    const teamProjectMembers: T[] = []

    // Iterate through the project members and separate them based on the `name` property
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
