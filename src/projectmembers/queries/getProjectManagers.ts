import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetProjectPrivilegeInput
  extends Pick<
    Prisma.ProjectPrivilegeFindManyArgs,
    "where" | "orderBy" | "skip" | "take" | "include"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100, include }: GetProjectPrivilegeInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: projectPrivilege,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.projectPrivilege.count({ where }),
      query: (paginateArgs) =>
        db.projectPrivilege.findMany({ ...paginateArgs, where, orderBy, include }),
    })

    return {
      projectPrivilege,
      nextPage,
      hasMore,
      count,
    }
  }
)
