import { getAnonymizedUser } from "src/core/utils/getAnonymizedUser"

export default function projectMemberMiddleware(prisma) {
  prisma.$use(async (params, next) => {
    if (
      params.model === "ProjectMember" &&
      (params.action === "findMany" || params.action === "findFirst")
    ) {
      const hasExplicitDeleted = "deleted" in (params.args.where || {})

      if (!hasExplicitDeleted) {
        params.args.where = {
          ...params.args.where,
          deleted: false, // ✅ Always filter out soft-deleted members unless caller overrides
        }
      }
    }

    // Middleware to anonymize User data if accessed through a deleted ProjectMember
    const result = await next(params)

    if (params.model === "ProjectMember" && params.action.startsWith("findMany")) {
      return Array.isArray(result)
        ? result.map((member) => ({
            ...member,
            users: member.deleted ? member.users.map(getAnonymizedUser) : member.users,
          }))
        : result.deleted
        ? { ...result, users: result.users.map(getAnonymizedUser) }
        : result
    }

    return result
  })
}
