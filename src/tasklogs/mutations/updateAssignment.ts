import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateAssignmentSchema } from "../schemas"
import sendNotification from "src/notifications/mutations/sendNotification"
import { getAssignmentStatusText } from "src/services/getAssignmentStatusText"

export default resolver.pipe(
  resolver.zod(UpdateAssignmentSchema),
  resolver.authorize(),
  async ({ id, metadata, status, completedBy, completedAs }, ctx) => {
    const assignmentStatusLog = await db.assignmentStatusLog.create({
      data: {
        assignmentId: id,
        metadata,
        status,
        completedBy,
        completedAs,
      },
    })

    // Send notification
    // Get information for the notification
    const assignment = await db.assignment.findUnique({
      where: { id: id },
      include: {
        task: true,
        // projectMember: true,
        // team: true
      },
    })

    let userIds: number[] = []

    // Check if the assignment is linked to a projectMember
    if (assignment && assignment.projectMemberId) {
      const projectMember = await db.projectMember.findUnique({
        where: { id: assignment.projectMemberId },
        include: {
          user: true,
        },
      })

      if (projectMember && projectMember.user) {
        userIds.push(projectMember.user.id)
      }
    }
    // If not a projectMember, check if the assignment is linked to a team
    else if (assignment && assignment.teamId) {
      const team = await db.team.findUnique({
        where: { id: assignment.teamId },
        include: {
          projectMembers: {
            include: {
              user: true,
            },
          },
        },
      })

      if (team && team.projectMembers) {
        userIds = team.projectMembers.map((contrib) => contrib.user.id)
      }
    }

    const completedByUsername = await db.projectMember
      .findUnique({ where: { id: completedBy! }, include: { user: true } })
      .then((result) => (result ? result.user.username : ""))

    await sendNotification(
      {
        templateId: "changedAssignment",
        recipients: userIds,
        data: {
          taskName: assignment!.task.name,
          completedBy: completedByUsername,
          assignmentStatus: getAssignmentStatusText(status),
        },
        projectId: assignment?.task["projectId"],
      },
      ctx
    )

    return assignmentStatusLog
  }
)
