import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetProjectManagersInput
  extends Pick<Prisma.ProjectPrivilegeFindManyArgs, "orderBy" | "include"> {
  projectId: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ projectId, orderBy, include }: GetProjectManagersInput) => {
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
