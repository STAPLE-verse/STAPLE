import { ExtendedProjectMember } from "src/assignments/hooks/useAssignmentData"
import { ExtendedTask } from "../components/TaskContext"

// Function gets unique contributors from Task obj returned by TaskContext
export function getUniqueProjectMembers(task: ExtendedTask) {
  // Collect individual contributors (where teamId is null)
  const individualProjectMembers = task.assignees
    .filter((assignment) => !assignment.teamId)
    .map((assignment) => assignment.contributor)
    .filter((contributor): contributor is ExtendedProjectMember => !!contributor) // Ensure contributor is not null

  // Collect team contributors (where teamId is not null)
  const teamProjectMembers = task.assignees
    .filter((assignment) => assignment.teamId)
    .flatMap((assignment) => assignment.team?.contributors || []) // Flatten the array of contributors within teams
    .filter((contributor): contributor is ExtendedProjectMember => !!contributor) // Ensure contributor is not null

  // Combine individual and team contributors
  const allProjectMembers = [...individualProjectMembers, ...teamProjectMembers]

  // Remove duplicates by using a Set with the contributor's id
  const uniqueProjectMembers = Array.from(
    new Set(allProjectMembers.map((contributor) => contributor.id))
  ).map((id) => allProjectMembers.find((contributor) => contributor.id === id)!)

  return uniqueProjectMembers
}
