import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetFormSchema = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(GetFormSchema), resolver.authorize(), async ({ id }) => {
  const form = await db.forms.findFirst({ where: { id } })

  if (!form) throw new NotFoundError()

  return form
})
