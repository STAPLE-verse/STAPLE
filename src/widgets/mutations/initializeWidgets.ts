import { resolver } from "@blitzjs/rpc"
import { requireSelf } from "src/projectprivileges/utils/requireAccess"
import { createDefaultWidgets } from "../utils/createDefaultWidgets"

export default resolver.pipe(resolver.authorize(), async (userId: number, ctx) => {
  requireSelf(ctx, userId)
  return createDefaultWidgets(userId)
})
