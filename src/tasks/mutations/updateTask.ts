import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskSchema } from "../schemas"

// Helper function to manage assignments
async function manageAssignments(
  taskId: number,
  currentIds: number[],
  newIds: number[],
  isTeam: boolean = false
) {
  // Compute IDs to add and delete
  const idsToDelete = currentIds.filter((id) => !newIds.includes(id))
  const idsToAdd = newIds.filter((id) => !currentIds.includes(id))

  // Create new assignments and disconnect old ones in a single transaction
  await db.$transaction(async (prisma) => {
    await Promise.all(
      idsToAdd.map((id) =>
        prisma.assignment.create({
          data: isTeam ? { taskId, teamId: id } : { taskId, contributorId: id },
        })
      )
    )
    await Promise.all(
      idsToDelete.map((id) =>
        prisma.assignment.deleteMany({
          where: isTeam ? { taskId, teamId: id } : { taskId, contributorId: id },
        })
      )
    )
  })
}

export default resolver.pipe(
  resolver.zod(UpdateTaskSchema),
  resolver.authorize(),
  async ({ id, contributorsId = [], teamsId = [], ...data }) => {
    // Update task data
    const task = await db.task.update({ where: { id }, data })

    // Get existing assignments for contributors and teams
    const existingAssignments = await db.assignment.findMany({
      where: { taskId: id },
      select: { contributorId: true, teamId: true },
    })

    const existingContributorIds = existingAssignments
      .map((a) => a.contributorId)
      .filter((id): id is number => id !== null)

    const existingTeamIds = existingAssignments
      .map((a) => a.teamId)
      .filter((id): id is number => id !== null)

    // TODO: later we have to clean up the logic for undefined an nullable values
    const safeContributorsId: number[] = contributorsId || []
    const safeTeamsId: number[] = teamsId || []

    // Manage contributor and team assignments
    await manageAssignments(id, existingContributorIds, safeContributorsId)
    await manageAssignments(id, existingTeamIds, safeTeamsId, true)

    return task
  }
)
