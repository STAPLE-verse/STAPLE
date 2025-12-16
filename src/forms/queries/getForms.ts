import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { Form, FormVersion } from "db"
import { paginate } from "blitz"

export interface FormWithFormVersion extends Form {
  formVersion: FormVersion | null
}

interface GetFormInput
  extends Pick<Prisma.FormFindManyArgs, "where" | "orderBy" | "include" | "skip" | "take"> {}

const includeLatestVersion = (include?: Prisma.FormInclude | null) =>
  include === null
    ? undefined
    : {
        ...(include ?? {}),
        versions: {
          orderBy: [{ version: "desc" as const }],
          take: 1,
        },
      }

const mapForms = (fetchedForms: (Form & { versions?: FormVersion[] })[]): FormWithFormVersion[] => {
  return fetchedForms.map((form) => ({
    ...form,
    formVersion: form.versions?.[0] || null,
  }))
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include, skip = 0, take }: GetFormInput) => {
    if (typeof take !== "number") {
      const [fetchedForms, count] = await Promise.all([
        db.form.findMany({
          where,
          orderBy,
          include: includeLatestVersion(include),
          skip,
        }),
        db.form.count({ where }),
      ])

      return {
        forms: mapForms(fetchedForms),
        nextPage: null,
        hasMore: false,
        count,
      }
    }

    const {
      items: fetchedForms,
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
          include: includeLatestVersion(include),
        }),
    })

    return {
      forms: mapForms(fetchedForms),
      nextPage,
      hasMore,
      count,
    }
  }
)
