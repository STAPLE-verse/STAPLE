import { ExtendedContributor } from "src/assignments/hooks/useAssignmentData"
import { ExtendedTask } from "../components/TaskContext"

// Function gets unique contributors from Task obj returned by TaskContext
export function getUniqueContributors(task: ExtendedTask) {
  // Collect individual contributors (where teamId is null)
  const individualContributors = task.assignees
    .filter((assignment) => !assignment.teamId)
    .map((assignment) => assignment.contributor)
    .filter((contributor): contributor is ExtendedContributor => !!contributor) // Ensure contributor is not null

  // Collect team contributors (where teamId is not null)
  const teamContributors = task.assignees
    .filter((assignment) => assignment.teamId)
    .flatMap((assignment) => assignment.team?.contributors || []) // Flatten the array of contributors within teams
    .filter((contributor): contributor is ExtendedContributor => !!contributor) // Ensure contributor is not null

  // Combine individual and team contributors
  const allContributors = [...individualContributors, ...teamContributors]

  // Remove duplicates by using a Set with the contributor's id
  const uniqueContributors = Array.from(
    new Set(allContributors.map((contributor) => contributor.id))
  ).map((id) => allContributors.find((contributor) => contributor.id === id)!)

  return uniqueContributors
}
