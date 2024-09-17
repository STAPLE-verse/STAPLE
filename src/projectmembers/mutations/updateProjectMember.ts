import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateProjectMemberSchema } from "../schemas"

async function connectLabels(contributorId, labelsId) {
  await db.$transaction(async (prisma) => {
    await db.projectmember.update({
      where: { id: contributorId },
      data: {
        labels: {
          set: [],
        },
      },
    })

    await db.projectmember.update({
      where: { id: contributorId },
      data: {
        labels: {
          connect: labelsId?.map((c) => ({ id: c })) || [],
        },
      },
    })
  })
}

export default resolver.pipe(
  resolver.zod(UpdateProjectMemberSchema),
  resolver.authorize(),
  async ({ id, labelsId = [], ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const contributor = await db.projectmember.update({ where: { id }, data })

    await connectLabels(id, labelsId)

    return contributor
  }
)
