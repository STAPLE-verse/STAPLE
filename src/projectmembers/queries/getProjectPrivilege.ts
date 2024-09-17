import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { ProjectPrivilege, Prisma } from "db"

interface GetProjectPrivilegeInput
  extends Pick<Prisma.ProjectPrivilegeFindFirstArgs, "where" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, include }: GetProjectPrivilegeInput) => {
    const projectPrivilege = await db.projectPrivilege.findFirst({ where, include })

    if (!projectPrivilege) throw new NotFoundError()

    return projectPrivilege as ProjectPrivilege
  }
)
