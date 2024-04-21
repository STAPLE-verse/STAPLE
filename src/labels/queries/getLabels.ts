import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetContributorLabelsInput
  extends Pick<
    Prisma.ContributorLabelFindManyArgs,
    "where" | "orderBy" | "skip" | "take" | "include"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100, include }: GetContributorLabelsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: labels,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.contributorLabel.count({ where }),
      query: (paginateArgs) =>
        db.contributorLabel.findMany({ ...paginateArgs, where, orderBy, include }),
    })

    return {
      labels,
      nextPage,
      hasMore,
      count,
    }
  }
)
