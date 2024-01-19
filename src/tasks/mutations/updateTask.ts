import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTaskSchema),
  resolver.authorize(),
  async ({ id, contributorsId, ...data }) => {
    // TODO: Assignment update logic needs to be implemented
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const task = await db.task.update({ where: { id }, data })

    if (contributorsId != undefined) {
      contributorsId.forEach(async (contributor) => {
        let contributorId = contributor["id"]
        if (contributor["checked"]) {
          //TODO could change this to create many??
          const assignment = await db.assignment.create({
            data: {
              task: { connect: { id: task.id } },
              contributor: { connect: { id: contributorId } },
            },
          })
        } else {
          await db.assignment.delete({ where: { id: contributor["assigmentId"] } })
        }
      })
    }

    return task
  }
)
