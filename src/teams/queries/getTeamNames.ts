import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetTeamNamesSchema = z.object({
  userId: z.number(),
  projectId: z.number().optional().nullable(),
})

export default resolver.pipe(
  resolver.zod(GetTeamNamesSchema),
  resolver.authorize(),
  async ({ userId, projectId }) => {
    // Fetch all project members where name is not null and the userId belongs to a user in the users array
    const projectMembers = await db.projectMember.findMany({
      where: {
        name: {
          not: null,
        },
        users: {
          some: {
            id: userId, // Check if any user in the users array has the given userId
          },
        },
        // Add optional projectId filter, only if projectId is provided
        ...(projectId !== null && {
          projectId: projectId, // Filter by projectId if it's provided
        }),
      },
      select: {
        name: true,
      },
    })

    // Extract the names into an array
    const names = projectMembers.map((member) => member.name)

    return names
  }
)
