import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { ProjectMember, Prisma } from "db"

interface GetProjectMemberInput
  extends Pick<Prisma.ProjectMemberFindFirstArgs, "where" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, include }: GetProjectMemberInput) => {
    const projectmember = await db.projectmember.findFirst({ where, include })

    if (!projectmember) throw new NotFoundError()

    return projectmember as ProjectMember
  }
)
