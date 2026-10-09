import { resolver } from "@blitzjs/rpc"
import db from "db"

import { requireProjectMember } from "src/projectprivileges/utils/requireAccess"
interface CountProjectManagersInput {
  projectId: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ projectId }: CountProjectManagersInput, ctx) => {
    await requireProjectMember(ctx, projectId)
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
