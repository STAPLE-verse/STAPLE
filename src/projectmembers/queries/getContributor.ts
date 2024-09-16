import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Contributor, Prisma } from "db"

interface GetContributorInput extends Pick<Prisma.ContributorFindFirstArgs, "where" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, include }: GetContributorInput) => {
    const contributor = await db.contributor.findFirst({ where, include })

    if (!contributor) throw new NotFoundError()

    return contributor as Contributor
  }
)
