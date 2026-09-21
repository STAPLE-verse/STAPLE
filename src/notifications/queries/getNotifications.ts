import { paginate, Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetNotificationsInput
  extends Pick<
    Prisma.NotificationFindManyArgs,
    "where" | "orderBy" | "skip" | "take" | "include"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include, skip = 0, take }: GetNotificationsInput, ctx: Ctx) => {
    // The caller's own `where` is treated as an additional filter (search
    // terms, project name, read status, etc.), never as the source of
    // ownership scoping — a client calling this RPC directly (bypassing the
    // React component that happens to build a scoped `where` today) could
    // otherwise pass `where: {}` and read every user's notifications. The
    // enforced clause is always AND-ed in, so a caller-supplied top-level OR
    // can't be used to escape it either.
    const scopedWhere: Prisma.NotificationWhereInput = {
      AND: [
        { recipients: { some: { id: ctx.session.userId as number } }, source: "STAPLE" },
        ...(where ? [where] : []),
      ],
    }

    if (typeof take !== "number") {
      const [notifications, count] = await Promise.all([
        db.notification.findMany({ where: scopedWhere, orderBy, include, skip }),
        db.notification.count({ where: scopedWhere }),
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
      count: () => db.notification.count({ where: scopedWhere }),
      query: (paginateArgs) =>
        db.notification.findMany({ ...paginateArgs, include, where: scopedWhere, orderBy }),
    })

    return {
      notifications,
      nextPage,
      hasMore,
      count,
    }
  }
)
