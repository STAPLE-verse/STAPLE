import { ExtendedProjectMember } from "src/tasklogs/hooks/useTaskLogData"
import { ExtendedTask } from "../components/TaskContext"

// Function gets unique projectMembers from Task obj returned by TaskContext
export function getUniqueProjectMember(task: ExtendedTask) {
  // Collect individual projectMembers (where teamId is null)
  const individualProjectMembers = task.assignees
    .filter((assignment) => !assignment.teamId)
    .map((assignment) => assignment.projectMember)
    .filter((projectMember): projectMember is ExtendedProjectMember => !!projectMember) // Ensure projectMember is not null

  // Collect team projectMembers (where teamId is not null)
  const teamProjectMembers = task.assignees
    .filter((assignment) => assignment.teamId)
    .flatMap((assignment) => assignment.team?.projectMembers || []) // Flatten the array of projectMembers within teams
    .filter((projectMember): projectMember is ExtendedProjectMember => !!projectMember) // Ensure projectMember is not null

  // Combine individual and team projectMembers
  const allProjectMembers = [...individualProjectMembers, ...teamProjectMembers]

  // Remove duplicates by using a Set with the projectMember's id
  const uniqueProjectMembers = Array.from(
    new Set(allProjectMembers.map((projectMember) => projectMember.id))
  ).map((id) => allProjectMembers.find((projectMember) => projectMember.id === id)!)

  return uniqueProjectMembers
}
