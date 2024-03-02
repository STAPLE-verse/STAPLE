import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

// import { prisma } from "@/utils/prisma";

export const revalidate = 0 //Very important

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

interface GetTeamsInput
  extends Pick<Prisma.TeamFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100, include }: GetTeamsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: teams,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.team.count({ where }),
      query: (paginateArgs) => db.team.findMany({ ...paginateArgs, where, orderBy, include }),
    })

    return {
      teams,
      nextPage,
      hasMore,
      count,
    }
  }
)
