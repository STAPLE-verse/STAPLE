import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateAssignmentSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateAssignmentSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const task = await db.assignment.update({ where: { id }, data })

    return task
  }
)
