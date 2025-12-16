import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetProjectMembersInput
  extends Pick<
    Prisma.ProjectMemberFindManyArgs,
    "where" | "orderBy" | "skip" | "take" | "include"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take, include }: GetProjectMembersInput) => {
    if (typeof take !== "number") {
      const [projectMembers, count] = await Promise.all([
        db.projectMember.findMany({ where, orderBy, include, skip }),
        db.projectMember.count({ where }),
      ])

      return { projectMembers, nextPage: null, hasMore: false, count }
    }

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: projectMembers,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.projectMember.count({ where }),
      query: (paginateArgs) =>
        db.projectMember.findMany({ ...paginateArgs, where, orderBy, include }),
    })

    return {
      projectMembers,
      nextPage,
      hasMore,
      count,
    }
  }
)
