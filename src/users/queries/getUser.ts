import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

export interface GetUserInput extends Pick<Prisma.UserFindFirstArgs, "where" | "include"> {}

export default resolver.pipe(resolver.authorize(), async ({ where, include }: GetUserInput) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const user = await db.user.findFirst({ where, include })

  if (!user) throw new NotFoundError()

  return user
})
