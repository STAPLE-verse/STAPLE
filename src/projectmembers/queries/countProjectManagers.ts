import { resolver } from "@blitzjs/rpc"
import db from "db"

interface CountProjectManagersInput {
  projectId: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ projectId }: CountProjectManagersInput) => {
    const count = await db.projectPrivilege.count({
      where: {
        projectId: projectId,
        privilege: "PROJECT_MANAGER",
        // deleted: false
      },
    })

    return count
  }
)
