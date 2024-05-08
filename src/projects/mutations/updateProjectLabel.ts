import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateProjectLabelSchema } from "../schemas"

async function updateProject(id, labelsId, disconnect) {
  let t
  await db.$transaction(async (prisma) => {
    if (disconnect) {
      const task = await db.project.update({
        where: { id: id },
        data: {
          labels: {
            set: [],
          },
        },
      })
    }

    t = db.project.update({
      where: { id: id },
      data: {
        labels: {
          connect: labelsId?.map((c) => ({ id: c })) || [],
        },
      },
    })
  })
  return t
}

export default resolver.pipe(
  resolver.zod(UpdateProjectLabelSchema),
  resolver.authorize(),
  async ({ projectsId, labelsId = [], disconnect, ...data }) => {
    let p = null
    projectsId.forEach(async (id) => {
      p = await updateProject(id, labelsId, disconnect)
    })

    // return task
    return p
  }
)
