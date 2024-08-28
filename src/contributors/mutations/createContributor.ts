import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateContributorSchema } from "../schemas"
import sendNotification from "src/notifications/mutations/sendNotification"
import { getPrivilegeText } from "src/services/getPrivilegeText"
import { vi } from "vitest"
import { hash256 } from "@blitzjs/auth"

const generatedToken = "plain-token"
vi.mock("@blitzjs/auth", async () => {
  const auth = await vi.importActual<Record<string, unknown>>("@blitzjs/auth")!
  return {
    ...auth,
    generateToken: () => hash256(generatedToken),
  }
})

//added by is the username of the PM who is adding

export default resolver.pipe(
  resolver.zod(CreateContributorSchema),
  resolver.authorize(),
  async (input, ctx) => {
    // Create contributor
    const contributor = await db.invitation.create({
      data: {
        projectId: input.projectId,
        privilege: input.privilege,
        email: input.email,
        invitationCode: generatedToken,
        addedBy: input.addedBy,
        labels: {
          connect: input.labelsId?.map((c) => ({ id: c })) || [],
        },
      },
    })

    return contributor
  }
)
