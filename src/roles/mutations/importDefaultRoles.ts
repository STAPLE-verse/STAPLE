import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { defaultRoleTemplates } from "../templates/defaultRoles"

const roleSystemIds = defaultRoleTemplates.map((r) => r.id) as [string, ...string[]]

const ImportRolesSchema = z.object({
  system: z.array(z.enum(roleSystemIds)),
  userId: z.number(),
})

export default resolver.pipe(
  resolver.zod(ImportRolesSchema),
  resolver.authorize(),
  async ({ system, userId }) => {
    // system is now an array of ids
    const allTemplates = system.flatMap((sysId) => {
      const matched = defaultRoleTemplates.find((r) => r.id === sysId)
      if (!matched) throw new Error(`Unknown role system: ${sysId}`)
      return matched.roles.map((role) => ({
        ...role,
        taxonomy: matched.label,
      }))
    })

    const createdRoles = await db.$transaction(
      allTemplates.map((role) =>
        db.role.create({
          data: {
            name: role.name,
            description: role.description,
            taxonomy: role.taxonomy,
            userId,
          },
        })
      )
    )

    return createdRoles
  }
)
