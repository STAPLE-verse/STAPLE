import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetNotificationsInput
  extends Pick<
    Prisma.NotificationFindManyArgs,
    "where" | "orderBy" | "skip" | "take" | "include"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include, skip = 0, take = 100 }: GetNotificationsInput) => {
    const {
      items: notifications,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.notification.count({ where }),
      query: (paginateArgs) =>
        db.notification.findMany({ ...paginateArgs, include, where, orderBy }),
    })

    return {
      notifications,
      nextPage,
      hasMore,
      count,
    }
  }
)
