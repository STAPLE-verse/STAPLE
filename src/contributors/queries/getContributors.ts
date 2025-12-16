import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { ProjectMemberWithUsers } from "src/core/types"
import { anonymizeNestedUsers } from "src/core/utils/anonymizeNestedUsers"
import { paginate } from "blitz"

interface GetContributorsInput
  extends Pick<Prisma.ProjectMemberFindManyArgs, "skip" | "take" | "orderBy"> {
  projectId: number
  deleted?: boolean
}

const validateContributors = (contributors: ProjectMemberWithUsers[]) => {
  contributors.forEach((contributor) => {
    if (contributor.users.length !== 1) {
      throw new Error(
        `Contributor with ID ${contributor.id} has ${contributor.users.length} users! Expected exactly 1.`
      )
    }
  })
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ projectId, deleted, skip = 0, take, orderBy = { id: "asc" } }: GetContributorsInput) => {
    const baseWhere: Prisma.ProjectMemberWhereInput = {
      projectId,
      deleted,
      name: null,
    }

    if (typeof take !== "number") {
      const [contributors, count] = await Promise.all([
        db.projectMember.findMany({
          where: baseWhere,
          orderBy,
          include: {
            users: true,
          },
          skip,
        }),
        db.projectMember.count({ where: baseWhere }),
      ])

      const processed = anonymizeNestedUsers(contributors) as ProjectMemberWithUsers[]
      validateContributors(processed)

      return { contributors: processed, nextPage: null, hasMore: false, count }
    }

    const {
      items: contributors,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.projectMember.count({ where: baseWhere }),
      query: (paginateArgs) =>
        db.projectMember.findMany({
          ...paginateArgs,
          where: baseWhere,
          orderBy,
          include: {
            users: true,
          },
        }),
    })

    const processed = anonymizeNestedUsers(contributors) as ProjectMemberWithUsers[]
    validateContributors(processed)

    return { contributors: processed, hasMore, nextPage, count }
  }
)
