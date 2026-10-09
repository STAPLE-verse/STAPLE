import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { anonymizeNestedUsers } from "src/core/utils/anonymizeNestedUsers"

import { scopeReadQuery, inMyProjects } from "src/projectprivileges/utils/scopeReadQuery"
export interface GetTaskInput extends Pick<Prisma.TaskFindFirstArgs, "where" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  scopeReadQuery(
    async ({ where, include }: GetTaskInput) => {
      // TODO: in multi-tenant app, you must add validation to ensure correct tenant
      const task = await db.task.findFirst({ where, include })

      if (!task) throw new NotFoundError()

      return anonymizeNestedUsers(task)
    },
    (access) => inMyProjects(access)
  )
)
