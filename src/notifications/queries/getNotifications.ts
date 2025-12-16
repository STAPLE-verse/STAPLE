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
  async ({ where, orderBy, include, skip = 0, take }: GetNotificationsInput) => {
    if (typeof take !== "number") {
      const [notifications, count] = await Promise.all([
        db.notification.findMany({ where, orderBy, include, skip }),
        db.notification.count({ where }),
      ])

      return {
        notifications,
        nextPage: null,
        hasMore: false,
        count,
      }
    }

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
