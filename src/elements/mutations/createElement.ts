import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateElementSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateElementSchema),
  resolver.authorize(),
  async ({ projectId, name, description }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const element = await db.element.create({
      data: {
        name,
        description,
        project: {
          connect: { id: projectId },
        },
      },
    })

    return element
  }
)
