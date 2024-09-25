import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteProjectMemberSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteProjectMemberSchema),
  resolver.authorize(),
  async ({ id }) => {
    const projectMemberToDelete = await db.projectMember.findUnique({ where: { id } })
    if (!projectMemberToDelete) {
      throw new Error("Contributor not found")
    }

    const projectManagerCount = await db.projectMember.count({
      where: {
        projectId: projectMemberToDelete.projectId,
        privilege: "PROJECT_MANAGER",
        deleted: false, // Consider only non-deleted projectMembers
      },
    })

    // Check if the projectMember to delete is the last project manager
    if (projectMemberToDelete.privilege === "PROJECT_MANAGER" && projectManagerCount <= 1) {
      throw new Error("Cannot delete the last project manager")
    }

    const projectMember = await db.projectMember.deleteMany({ where: { id } })

    return projectMember
  }
)
