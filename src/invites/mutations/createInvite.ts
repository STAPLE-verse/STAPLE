import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateInviteSchema } from "../schemas"

function generateToken(n) {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  var token = ""
  for (var i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}

export default resolver.pipe(
  resolver.zod(CreateInviteSchema),
  resolver.authorize(),
  async (input) => {
    let textResult
    // check to make sure email not already there
    const findcontributor = await db.contributor.findFirst({
      where: {
        projectId: input.projectId,
        user: { email: input.email },
      },
    })

    if (findcontributor) {
      textResult = {
        code: "already_added",
        findcontributor,
      }
    } else {
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

      textResult = {
        code: "invite_sent",
        contributor,
      }
    }

    return textResult
  }
)
