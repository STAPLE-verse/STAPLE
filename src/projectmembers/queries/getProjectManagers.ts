import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

import { requireProjectMember } from "src/projectprivileges/utils/requireAccess"
interface GetProjectManagersInput
  extends Pick<Prisma.ProjectPrivilegeFindManyArgs, "orderBy" | "include"> {
  projectId: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ projectId, orderBy, include }: GetProjectManagersInput, ctx) => {
    await requireProjectMember(ctx, projectId)
    const projectManagers = await db.projectPrivilege.findMany({
      where: {
        projectId: projectId,
        privilege: "PROJECT_MANAGER",
      },
      orderBy,
      include,
    })

    return projectManagers
  }
)
