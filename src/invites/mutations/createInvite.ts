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
    input.email = input.email.toLowerCase()

    let textResult

    // Check if the user is already a soft-deleted project member
    const softDeletedProjectMember = await db.projectMember.findFirst({
      where: {
        projectId: input.projectId,
        name: null,
        deleted: true,
        users: {
          some: { email: { equals: input.email, mode: "insensitive" } }, // Match by email
        },
      },
    })

    if (softDeletedProjectMember) {
      // Create a reassignment invitation
      await db.invitation.create({
        data: {
          projectId: input.projectId,
          privilege: input.privilege,
          email: input.email.toLowerCase(),
          invitationCode: generateToken(20),
          addedBy: input.addedBy,
          tags: input.tags ?? undefined,
          roles: {
            connect: input.rolesId?.map((c) => ({ id: c })) || [],
          },
          reassignmentFor: softDeletedProjectMember.id, // Link to the soft-deleted project member
        },
      })

      // Return a flag to indicate this user can be restored
      textResult = {
        code: "restore_possible",
        projectmember: softDeletedProjectMember,
      }
    } else {
      // Check if the user is already an active project member
      const activeProjectMember = await db.projectMember.findFirst({
        where: {
          projectId: input.projectId,
          name: null,
          users: {
            some: { email: { equals: input.email, mode: "insensitive" } }, // Use `some` to query an array field
          },
        },
      })

      if (activeProjectMember) {
        textResult = {
          code: "already_added",
          projectmember: activeProjectMember,
        }
      } else {
        // Create a new intivation
        const projectmember = await db.invitation.create({
          data: {
            projectId: input.projectId,
            privilege: input.privilege,
            email: input.email.toLowerCase(),
            invitationCode: generateToken(20),
            addedBy: input.addedBy,
            tags: input.tags ?? undefined,
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
    }

    return textResult
  }
)
