import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateContributorSchema } from "../schemas"

function generateToken(n) {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  var token = ""
  for (var i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}

export default resolver.pipe(
  resolver.zod(CreateContributorSchema),
  resolver.authorize(),
  async (input, ctx) => {
    console.log(input)
    // Create contributor
    const contributor = await db.invitation.create({
      data: {
        projectId: input.projectId,
        privilege: input.privilege,
        email: input.email,
        invitationCode: generateToken(20),
        addedBy: input.addedBy,
        labels: {
          connect: input.labelsId?.map((c) => ({ id: c })) || [],
        },
      },
    })

    return contributor
  }
)
