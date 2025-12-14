import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteProjectMemberSchema } from "../schemas"
import countProjectManagers from "../queries/countProjectManagers"

export default resolver.pipe(
  resolver.zod(DeleteProjectMemberSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    // Find the project member to be deleted
    const projectMemberToDelete = await db.projectMember.findUnique({
      where: { id },
      include: { users: true },
    })

    // Check if projectMemberToDelete is undefined or has no users
    if (!projectMemberToDelete) {
      throw new Error("Contributor not found")
    }

    // Ensure there's exactly one user associated with this project member
    if (projectMemberToDelete.users.length !== 1) {
      throw new Error("Invalid number of users associated with this project member")
    }

    // Get the userId from the associated users array
    const userId = projectMemberToDelete.users[0]!.id

    // Reconstruct possible display names used in notification messages
    const user = projectMemberToDelete.users[0]
    const possibleDisplayNames: string[] = []

    if (user!.firstName && user!.lastName) {
      possibleDisplayNames.push(`${user!.firstName} ${user!.lastName}`)
    }

    if (user!.username) {
      possibleDisplayNames.push(user!.username)
    }

    const notificationMarker = " (former contributor)"

    // Check if the project member has any privileges related to the project
    const projectPrivilege = await db.projectPrivilege.findFirst({
      where: {
        userId: userId,
        projectId: projectMemberToDelete.projectId,
      },
    })

    if (!projectPrivilege) {
      throw new Error("Project privilege not found for the user")
    }

    // Count the number of project managers in the project using the countProjectManagers query
    const projectManagerCount = await countProjectManagers(
      {
        projectId: projectMemberToDelete.projectId,
      },
      ctx
    )

    // Check if the projectMember to delete is the last project manager
    if (projectPrivilege.privilege === "PROJECT_MANAGER" && projectManagerCount <= 1) {
      throw new Error("Cannot delete the last project manager on the project.")
    }

    // Delete project widgets associated with this user and project
    await db.projectWidget.deleteMany({
      where: {
        userId: userId,
        projectId: projectMemberToDelete.projectId,
      },
    })

    // Proceed to delete the project privilege
    await db.projectPrivilege.delete({
      where: { id: projectPrivilege.id },
    })

    // Annotate existing notifications that reference this contributor by name
    if (possibleDisplayNames.length > 0) {
      const notifications = await db.notification.findMany({
        where: {
          projectId: projectMemberToDelete.projectId,
          announcement: false,
        },
      })

      await Promise.all(
        notifications
          .filter(
            (n) =>
              !n.message.includes(notificationMarker) &&
              possibleDisplayNames.some((name) => n.message.includes(name))
          )
          .map((n) =>
            db.notification.update({
              where: { id: n.id },
              data: {
                message: `${n.message}${notificationMarker}`,
              },
            })
          )
      )
    }

    // Delete the project member
    const projectMember = await db.projectMember.update({
      where: { id: projectMemberToDelete.id },
      data: { deleted: true },
    })

    return projectMember
  }
)
