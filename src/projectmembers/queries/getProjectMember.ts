import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { ProjectMember, Prisma } from "db"

interface GetProjectMemberInput
  extends Pick<Prisma.ProjectMemberFindFirstArgs, "where" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, include }: GetProjectMemberInput) => {
    const projectMember = await db.projectMember.findFirst({ where, include })

    if (!projectMember) throw new NotFoundError()

    return projectMember as ProjectMember
  }
)
