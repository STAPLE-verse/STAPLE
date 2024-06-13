import { Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import getNotifications from "./getNotifications"

export default resolver.pipe(resolver.authorize(), async (undefined, ctx: Ctx) => {
  const { notifications } = await getNotifications(
    {
      where: {
        recipients: {
          some: {
            id: ctx.session.userId as number,
          },
        },
        read: false,
      },
      orderBy: { id: "desc" },
      take: 3,
    },
    ctx
  )

  return {
    notifications,
  }
})
