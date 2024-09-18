import { ExtendedAssignment } from "./useAssignmentData"

type UseFilterContributorAssignmentType = {
  filteredIndividualAssignments: ExtendedAssignment[]
  filteredTeamAssignments: ExtendedAssignment[]
}

export function useFilterContributorAssignment(
  individualAssignments: ExtendedAssignment[],
  teamAssignments: ExtendedAssignment[],
  currentContributorId: number
): UseFilterContributorAssignmentType {
  // Filter out individual assignments
  const filteredIndividualAssignments = individualAssignments.filter(
    (assignment) =>
      assignment.contributorId !== null && assignment.contributorId == currentContributorId
  )

  // Filter out team assignments
  const filteredTeamAssignments = teamAssignments.filter((assignment) => {
    return (
      assignment.teamId !== null &&
      assignment.team?.contributors?.some((contributor) => contributor.id === currentContributorId)
    )
  })

  return {
    filteredIndividualAssignments,
    filteredTeamAssignments,
  }
}
