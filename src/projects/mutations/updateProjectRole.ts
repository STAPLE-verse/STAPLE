// @ts-nocheck
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateProjectLabelSchema } from "../schemas"

async function updateProject(id, rolesId, disconnect) {
  let t
  await db.$transaction(async (prisma) => {
    if (disconnect) {
      const task = await db.project.update({
        where: { id: id },
        data: {
          roles: {
            set: [],
          },
        },
      })
    }

    t = db.project.update({
      where: { id: id },
      data: {
        roles: {
          connect: rolesId?.map((c) => ({ id: c })) || [],
        },
      },
    })
  })
  return t
}

export default resolver.pipe(
  resolver.zod(UpdateProjectLabelSchema),
  resolver.authorize(),
  async ({ projectsId, rolesId = [], disconnect, ...data }) => {
    let p = null
    projectsId.forEach(async (id) => {
      p = await updateProject(id, rolesId, disconnect)
    })

    // return task
    return p
  }
)
