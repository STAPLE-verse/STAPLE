import { resolver } from "@blitzjs/rpc"
import db, { CompletedAs } from "db"
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

// Helper function to manage taskLogs
async function manageTaskLogs(
  taskId: number,
  currentIds: number[],
  newIds: number[],
  isTeam: boolean = false
) {
  // Compute IDs to add and delete
  const idsToDelete = currentIds.filter((id) => !newIds.includes(id))
  const idsToAdd = newIds.filter((id) => !currentIds.includes(id))

  // Determine the completedAs value based on the isTeam flag
  const completedAsValue = isTeam ? CompletedAs.TEAM : CompletedAs.INDIVIDUAL

  // Create new taskLog and disconnect old ones in a single transaction
  await db.$transaction(async (prisma) => {
    await Promise.all(
      idsToAdd.map((id) =>
        prisma.taskLog.create({
          data: {
            taskId,
            assignedToId: id,
            completedAs: completedAsValue, // Set completedAs based on isTeam flag
          },
        })
      )
    )
    await Promise.all(
      idsToDelete.map((id) =>
        prisma.taskLog.deleteMany({
          where: { taskId, assignedToId: id },
        })
      )
    )
  })
}

// Helper function to manage assigned project members
async function manageAssignedMembers(taskId: number, currentIds: number[], newIds: number[]) {
  const idsToDelete = currentIds.filter((id) => !newIds.includes(id))
  const idsToAdd = newIds.filter((id) => !currentIds.includes(id))

  await db.task.update({
    where: { id: taskId },
    data: {
      assignedMembers: {
        disconnect: idsToDelete.map((id) => ({ id })), // Disconnect old members
        connect: idsToAdd.map((id) => ({ id })), // Connect new members
      },
    },
  })
}

export default resolver.pipe(
  resolver.zod(UpdateTaskSchema),
  resolver.authorize(),
  async ({ id, projectMembersId = [], teamsId = [], rolesId = [], ...data }) => {
    // TODO: later we have to clean up the logic for undefined an nullable values
    const safeProjectMembersId: number[] = projectMembersId || []
    const safeTeamsId: number[] = teamsId || []

    // Update task data
    const task = await db.task.update({ where: { id }, data })

    // Fetch existing assigned project members for the task
    const existingTask = await db.task.findUnique({
      where: { id },
      select: {
        assignedMembers: {
          select: { id: true }, // Only select the IDs of assigned members
        },
      },
    })

    // Get the current assigned member IDs
    const existingAssignedMemberIds = existingTask?.assignedMembers.map((member) => member.id) || []

    // Update assigned members on the task
    await manageAssignedMembers(id, existingAssignedMemberIds, [
      ...safeProjectMembersId,
      ...safeTeamsId,
    ])

    // Update taskLog data
    // Get existing taskLogs for projectMembers and teams
    const existingTaskLogs = await db.taskLog.findMany({
      where: { taskId: id },
      select: {
        assignedToId: true,
        completedAs: true,
      },
    })

    const teamProjectMemberIds = new Set<number>()
    const individualProjectMemberIds = new Set<number>()

    existingTaskLogs.forEach((taskLog) => {
      if (taskLog.assignedToId !== null) {
        if (taskLog.completedAs === CompletedAs.TEAM) {
          teamProjectMemberIds.add(taskLog.assignedToId) // Add to team set
        } else if (taskLog.completedAs === CompletedAs.INDIVIDUAL) {
          individualProjectMemberIds.add(taskLog.assignedToId) // Add to individual set
        }
      }
    })

    // Convert sets to arrays and keep only unique ids
    const uniqueTeamProjectMemberIds = Array.from(teamProjectMemberIds)
    const uniqueIndividualProjectMemberIds = Array.from(individualProjectMemberIds)

    // Manage projectMember and team taskLogs
    await manageTaskLogs(id, uniqueIndividualProjectMemberIds, safeProjectMembersId)
    await manageTaskLogs(id, uniqueTeamProjectMemberIds, safeTeamsId, true)

    // Update roles data
    await manageRoles(id, rolesId)

    return task
  }
)
