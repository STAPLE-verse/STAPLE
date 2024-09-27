import { Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import getProjects from "./getProjects"

export default resolver.pipe(resolver.authorize(), async (undefined, ctx: Ctx) => {
  const { projects } = await getProjects(
    {
      where: {
        projectMembers: {
          some: {
            users: {
              some: { id: ctx.session.userId as number },
            },
            deleted: false,
          },
        },
      },
      orderBy: { updatedAt: "asc" },
      take: 3,
    },
    ctx
  )

  return {
    projects,
  }
})
