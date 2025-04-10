import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { anonymizeNestedUsers } from "src/core/utils/anonymizeNestedUsers"

export interface GetTaskInput extends Pick<Prisma.TaskFindFirstArgs, "where" | "include"> {}

export default resolver.pipe(resolver.authorize(), async ({ where, include }: GetTaskInput) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const task = await db.task.findFirst({ where, include })

  if (!task) throw new NotFoundError()

  return anonymizeNestedUsers(task)
})
