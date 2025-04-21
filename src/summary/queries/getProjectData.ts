import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetProjectData = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetProjectData), resolver.authorize(), async ({ id }) => {
  const project = await db.project.findFirst({
    where: { id },
    include: {
      formVersion: true,
      tasks: {
        include: {
          element: true,
          roles: true,
          taskLogs: true,
          formVersion: true,
        },
      },
      projectMembers: {
        include: {
          users: {
            select: {
              institution: true,
              username: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          roles: true,
        },
      },
    },
  })

  if (!project) throw new NotFoundError()

  return project
})
