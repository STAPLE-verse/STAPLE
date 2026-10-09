import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

import { scopeReadQuery } from "src/projectprivileges/utils/scopeReadQuery"
interface GetTaskLogInput extends Pick<Prisma.TaskLogFindFirstArgs, "where" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  scopeReadQuery(
    async ({ where }: GetTaskLogInput) => {
      const taskLog = await db.taskLog.findFirst({ where })

      // if (!TaskLog) throw new NotFoundError()

      return taskLog
    },
    (access) => ({ task: { projectId: { in: access.memberProjectIds } } })
  )
)
