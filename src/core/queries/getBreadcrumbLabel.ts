import { resolver } from "@blitzjs/rpc"
import db from "db"
import { BreadcrumbLabelInput, BreadcrumbLabelInputType } from "../schemas"

export default resolver.pipe(
  resolver.zod(BreadcrumbLabelInput), // validate first
  async (input: BreadcrumbLabelInputType, ctx) => {
    await ctx.session.$authorize() // call authorize here

    switch (input.type) {
      case "project":
        return (await db.project.findUnique({ where: { id: input.id }, select: { name: true } }))
          ?.name

      case "task":
        return (await db.task.findUnique({ where: { id: input.id }, select: { name: true } }))?.name

      case "element":
        return (await db.element.findUnique({ where: { id: input.id }, select: { name: true } }))
          ?.name

      case "team":
        return (
          await db.projectMember.findUnique({
            where: { id: input.id },
            select: { name: true },
          })
        )?.name

      case "contributor": {
        const member = await db.projectMember.findUnique({
          where: { id: input.id },
          include: { users: true },
        })
        const user = member?.users?.[0]
        return user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.username ?? "Unknown"
      }
    }
  }
)
