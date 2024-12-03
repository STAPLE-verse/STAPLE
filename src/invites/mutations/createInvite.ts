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
    const findprojectmember = await db.projectMember.findFirst({
      where: {
        projectId: input.projectId,
        name: null,
        users: {
          some: { email: input.email }, // Use `some` to query an array field
        },
      },
    })

    if (findprojectmember) {
      textResult = {
        code: "already_added",
        findprojectmember,
      }
    } else {
      // Create projectmember
      const projectmember = await db.invitation.create({
        data: {
          projectId: input.projectId,
          privilege: input.privilege,
          email: input.email,
          invitationCode: generateToken(20),
          addedBy: input.addedBy,
          roles: {
            connect: input.rolesId?.map((c) => ({ id: c })) || [],
          },
        },
      })

      textResult = {
        code: "invite_sent",
        projectmember,
      }
    }

    return textResult
  }
)
