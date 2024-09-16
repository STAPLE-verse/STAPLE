import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateContributorSchema } from "../schemas"

async function connectLabels(contributorId, labelsId) {
  await db.$transaction(async (prisma) => {
    await db.contributor.update({
      where: { id: contributorId },
      data: {
        labels: {
          set: [],
        },
      },
    })

    await db.contributor.update({
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
  resolver.zod(UpdateContributorSchema),
  resolver.authorize(),
  async ({ id, labelsId = [], ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const contributor = await db.contributor.update({ where: { id }, data })

    await connectLabels(id, labelsId)

    return contributor
  }
)
