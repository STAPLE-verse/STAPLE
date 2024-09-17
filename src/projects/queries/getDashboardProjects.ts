import { Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import getProjects from "./getProjects"

export default resolver.pipe(resolver.authorize(), async (undefined, ctx: Ctx) => {
  const { projects } = await getProjects(
    {
      where: {
        projectMembers: {
          users: {
            some: { id: ctx.session.userId as number },
          },
          // make sure they haven't been deleted from the project
          deleted: false,
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
