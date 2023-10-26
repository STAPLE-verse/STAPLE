import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetTask = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
  include: z
    .object({
      element: z.boolean().optional(),
      column: z.boolean().optional(),
    })
    .optional(),
})

export default resolver.pipe(
  resolver.zod(GetTask),
  resolver.authorize(),
  async ({ id, include }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const task = await db.task.findFirst({ where: { id }, include })

    if (!task) throw new NotFoundError()

    return task
  }
)
