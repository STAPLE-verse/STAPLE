import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetFormsInput
  extends Pick<Prisma.FormsFindManyArgs, "where" | "orderBy" | "skip" | "take" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include, skip = 0, take = 100 }: GetFormsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: forms,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.forms.count({ where }),
      query: (paginateArgs) =>
        db.forms.findMany({
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

    const formattedForms = forms.map((form) => {
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
