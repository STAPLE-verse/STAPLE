import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteProjectMemberSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteProjectMemberSchema),
  resolver.authorize(),
  async ({ id }) => {
    const contributorToDelete = await db.projectmember.findUnique({ where: { id } })
    if (!contributorToDelete) {
      throw new Error("Contributor not found")
    }

    const projectManagerCount = await db.projectmember.count({
      where: {
        projectId: contributorToDelete.projectId,
        privilege: "PROJECT_MANAGER",
        deleted: false, // Consider only non-deleted contributors
      },
    })

    // Check if the contributor to delete is the last project manager
    if (contributorToDelete.privilege === "PROJECT_MANAGER" && projectManagerCount <= 1) {
      throw new Error("Cannot delete the last project manager")
    }

    const contributor = await db.contributor.deleteMany({ where: { id } })

    return contributor
  }
)
