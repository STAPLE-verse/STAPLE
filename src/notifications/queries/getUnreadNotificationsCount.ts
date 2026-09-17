import { Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetUnreadNotificationsCountInput extends Pick<Prisma.NotificationFindManyArgs, "where"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where }: GetUnreadNotificationsCountInput, ctx: Ctx) => {
    // See getNotifications.ts — the caller's `where` is an additional filter
    // only, never the source of ownership scoping.
    const scopedWhere: Prisma.NotificationWhereInput = {
      AND: [
        { recipients: { some: { id: ctx.session.userId as number } }, source: "STAPLE" },
        ...(where ? [where] : []),
      ],
    }

    const totalCount = await db.notification.count({
      where: scopedWhere,
    })

    const unreadCount = await db.notification.count({
      where: {
        AND: [scopedWhere, { read: false }],
      },
    })

    return {
      totalCount,
      unreadCount,
    }
  }
)
