import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetTeamNamesSchema = z.object({
  userId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetTeamNamesSchema),
  resolver.authorize(),
  async ({ userId }) => {
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
