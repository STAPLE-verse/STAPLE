import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { ProjectMember, Prisma } from "db"

import { scopeReadQuery, inMyProjects } from "src/projectprivileges/utils/scopeReadQuery"
interface GetProjectMemberInput
  extends Pick<Prisma.ProjectMemberFindFirstArgs, "where" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  scopeReadQuery(
    async ({ where, include }: GetProjectMemberInput) => {
      // TODO: consider using findUnique because findFirst returns something even if where: {id: undefined}
      const projectMember = await db.projectMember.findFirst({ where, include })

      if (!projectMember) throw new NotFoundError()

      return projectMember as ProjectMember
    },
    (access) => inMyProjects(access)
  )
)
