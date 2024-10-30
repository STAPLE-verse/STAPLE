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

    // Delete associated task logs for this project member
    await db.taskLog.deleteMany({
      where: { assignedToId: projectMemberToDelete.id },
    })

    // Delete the project member
    const projectMember = await db.projectMember.delete({
      where: { id: projectMemberToDelete.id },
    })

    return projectMember
  }
)
