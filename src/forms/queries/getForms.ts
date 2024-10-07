import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetFormInput
  extends Pick<Prisma.FormFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include, skip = 0, take = 100 }: GetFormInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: form,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.form.count({ where }),
      query: (paginateArgs) =>
        db.form.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            ...include,
            versions: {
              orderBy: { version: "desc" },
              take: 1,
            },
          },
        }),
    })

    const formattedForms = form.map((form) => {
      return {
        ...form,
        formVersion: form.versions[0] || null,
      }
    })

    return {
      forms: formattedForms,
      nextPage,
      hasMore,
      count,
    }
  }
)
