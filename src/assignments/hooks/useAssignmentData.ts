import { useQuery } from "@blitzjs/rpc"
import { Assignment, AssignmentStatusLog, Contributor, Team } from "db"
import getAssignments from "src/assignments/queries/getAssignments"
import getContributor from "src/contributors/queries/getContributor"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

export type AssignmentsType = Assignment & {
  contributor?: Contributor | null
  team?: Team | null
  statusLogs?: AssignmentStatusLog[]
}

type AssignmentsDataType = {
  individualAssignments: AssignmentsType[]
  teamAssignments: AssignmentsType[]
  refetchCurrentAssignments: () => void
}

export default function useAssignmentData(
  taskId: number | undefined,
  projectId: number | undefined
): AssignmentsDataType {
  const currentUser = useCurrentUser()

  // TODO: Replace by hook
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })

  // Get assignments for the task
  // If someone is assigned as an individual AND as a Team member it is possible to have multiple assignments for the same person for the task
  const [currentAssignments, { refetch: refetchCurrentAssignments }] = useQuery(getAssignments, {
    where: {
      taskId: taskId,
      // Get only assignments for the current contributor
      OR: [
        { contributorId: currentContributor.id }, // Direct assignments to the contributor
        { team: { contributors: { some: { id: currentContributor.id } } } }, // Assignments to teams that include the contributor
      ],
    },
    include: {
      contributor: true,
      team: true,
      statusLogs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    // Keeping the ordering so that completeToggle button order does not change on refetch
    orderBy: {
      id: "asc",
    },
  })

  // Filter out individual assignments
  const individualAssignments = currentAssignments.filter(
    (assignment) => assignment.contributorId !== null
  )

  // Filter out team assignments
  const teamAssignments = currentAssignments.filter((assignment) => assignment.teamId !== null)

  return {
    individualAssignments: individualAssignments,
    teamAssignments: teamAssignments,
    refetchCurrentAssignments: refetchCurrentAssignments,
  }
}
