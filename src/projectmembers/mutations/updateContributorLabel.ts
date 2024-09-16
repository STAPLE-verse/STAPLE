import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateContributorLabelSchema } from "../schemas"

async function updateContributor(id, labelsId, disconnect) {
  let r
  await db.$transaction(async (prisma) => {
    if (disconnect) {
      const c = await db.contributor.update({
        where: { id: id },
        data: {
          labels: {
            set: [],
          },
        },
      })
    }

    r = db.contributor.update({
      where: { id: id },
      data: {
        labels: {
          connect: labelsId?.map((c) => ({ id: c })) || [],
        },
      },
    })
  })
  return r
}

export default resolver.pipe(
  resolver.zod(UpdateContributorLabelSchema),
  resolver.authorize(),
  async ({ contributorsId, labelsId = [], disconnect, ...data }) => {
    let c = null
    contributorsId.forEach(async (id) => {
      c = await updateContributor(id, labelsId, disconnect)
    })

    // return task
    return c
  }
)
