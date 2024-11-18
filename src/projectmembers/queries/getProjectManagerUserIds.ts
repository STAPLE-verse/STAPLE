import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetProjectManagerUserIdsInput
  extends Pick<Prisma.ProjectPrivilegeFindManyArgs, "orderBy"> {
  projectId: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ projectId, orderBy }: GetProjectManagerUserIdsInput): Promise<number[]> => {
    const projectManagers = await db.projectPrivilege.findMany({
      where: {
        projectId: projectId,
        privilege: "PROJECT_MANAGER",
      },
      select: {
        userId: true, // Only select userId
      },
      orderBy,
    })

    // Extract user IDs from the results and return them as an array
    return projectManagers.map((manager) => manager.userId)
  }
)
