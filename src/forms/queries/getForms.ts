import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { Form, FormVersion } from "db"

export interface FormWithFormVersion extends Form {
  formVersion: FormVersion | null
}

interface GetFormInput extends Pick<Prisma.FormFindManyArgs, "where" | "orderBy" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include }: GetFormInput): Promise<FormWithFormVersion[]> => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const fetchedForms = await db.form.findMany({
      where,
      orderBy,
      include: {
        ...include,
        versions: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    })

    const forms: FormWithFormVersion[] = fetchedForms.map((form) => {
      return {
        ...form,
        formVersion: form.versions[0] || null,
      }
    })

    return forms
  }
)
