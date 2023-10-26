import db, { Prisma } from "db"
import { resolver } from "@blitzjs/rpc"

interface GetUsersInput
  extends Pick<
    Prisma.UserFindManyArgs,
    "where" | "orderBy" | "skip" | "take" | "include" | "select"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip, take, include, select }: GetUsersInput) => {
    const query: GetUsersInput = {
      where,
      orderBy,
      skip,
      take,
      include,
      select,
    }

    // select: {
    //   id: true,
    //   firstName: true,
    //   lastName: true,
    //   email: true,
    //   role: true,
    //   createdAt: true,
    //   username: true,
    // },
    const users = await db.user.findMany(query)

    return users
  }
)
