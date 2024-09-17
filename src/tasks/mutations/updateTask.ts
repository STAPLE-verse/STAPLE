import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskSchema } from "../schemas"

async function manageRoles(taskId, rolesId) {
  await db.$transaction(async (prisma) => {
    await db.task.update({
      where: { id: taskId },
      data: {
        roles: {
          set: [],
        },
      },
    })

    await db.task.update({
      where: { id: taskId },
      data: {
        roles: {
          connect: rolesId?.map((c) => ({ id: c })) || [],
        },
      },
    })
  })
}

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
          data: isTeam ? { taskId, teamId: id } : { taskId, projectMemberId: id },
        })
      )
    )
    await Promise.all(
      idsToDelete.map((id) =>
        prisma.assignment.deleteMany({
          where: isTeam ? { taskId, teamId: id } : { taskId, projectMemberId: id },
        })
      )
    )
  })
}

export default resolver.pipe(
  resolver.zod(UpdateTaskSchema),
  resolver.authorize(),
  async ({ id, projectMembersId = [], teamsId = [], rolesId = [], ...data }) => {
    // Update task data
    const task = await db.task.update({ where: { id }, data })

    // Get existing assignments for projectMembers and teams
    const existingAssignments = await db.assignment.findMany({
      where: { taskId: id },
      select: { projectMemberId: true, teamId: true },
    })

    const existingProjectMemberIds = existingAssignments
      .map((a) => a.projectMemberId)
      .filter((id): id is number => id !== null)

    const existingTeamIds = existingAssignments
      .map((a) => a.teamId)
      .filter((id): id is number => id !== null)

    // TODO: later we have to clean up the logic for undefined an nullable values
    const safeProjectMembersId: number[] = projectMembersId || []
    const safeTeamsId: number[] = teamsId || []

    // Manage projectMember and team assignments
    await manageAssignments(id, existingProjectMemberIds, safeProjectMembersId)
    await manageAssignments(id, existingTeamIds, safeTeamsId, true)
    await manageRoles(id, rolesId)

    return task
  }
)
