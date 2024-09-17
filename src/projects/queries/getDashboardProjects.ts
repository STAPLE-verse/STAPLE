import { Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import getProjects from "./getProjects"

export default resolver.pipe(resolver.authorize(), async (undefined, ctx: Ctx) => {
  const { projects } = await getProjects(
    {
      where: {
        projectMembers: {
          some: {
            userId: ctx.session.userId as number,
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
