export default function projectMemberMiddleware(prisma) {
  prisma.$use(async (params, next) => {
    if (params.model === "ProjectMember") {
      if (params.action === "findMany") {
        params.args.where = {
          ...params.args.where,
          deleted: false,
        }
      }
      if (params.action === "findFirst") {
        params.args.where = { ...params.args.where, deleted: false }
      }
      if (params.action === "delete") {
        throw new Error("Direct deletion of ProjectMember is not allowed. Use soft delete instead.")
      }
    }

    // Middleware to anonymize User data if accessed through a deleted ProjectMember
    const result = await next(params)

    if (params.model === "ProjectMember" && params.action === "findMany") {
      return result.map((member) => {
        if (member.deleted && member.users) {
          return {
            ...member,
            users: member.users.map((user) => ({
              ...user,
              firstName: "anonymous",
              lastName: "anonymous",
              username: "anonymous",
            })),
          }
        }
        return member
      })
    }

    return result
  })
}
