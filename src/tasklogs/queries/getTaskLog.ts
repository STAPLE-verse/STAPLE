import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetAssingmentInput extends Pick<Prisma.TaskLogFindFirstArgs, "where" | "include"> {}

export default resolver.pipe(resolver.authorize(), async ({ where }: GetAssingmentInput) => {
  const taskLog = await db.taskLog.findFirst({ where })

  // if (!assignment) throw new NotFoundError()

  return taskLog
})
