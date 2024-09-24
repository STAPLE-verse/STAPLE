import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetTaskLogInput extends Pick<Prisma.TaskLogFindFirstArgs, "where" | "include"> {}

export default resolver.pipe(resolver.authorize(), async ({ where }: GetTaskLogInput) => {
  const taskLog = await db.taskLog.findFirst({ where })

  // if (!TaskLog) throw new NotFoundError()

  return taskLog
})
