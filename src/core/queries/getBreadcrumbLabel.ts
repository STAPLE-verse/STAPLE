import { resolver } from "@blitzjs/rpc"
import db from "db"
import { BreadcrumbLabelInput, BreadcrumbLabelInputType } from "../schemas"
import {
  requireFormOwner,
  requireMemberOf,
  requireProjectMember,
} from "src/projectprivileges/utils/requireAccess"

export default resolver.pipe(
  resolver.zod(BreadcrumbLabelInput), // validate first
  async (input: BreadcrumbLabelInputType, ctx) => {
    await ctx.session.$authorize() // call authorize here

    // Labels name things (projects, tasks, people), so only give them for what the caller may see
    try {
      switch (input.type) {
        case "project":
          await requireProjectMember(ctx, input.id)
          break
        case "task":
        case "milestone":
          await requireMemberOf(ctx, input.type, [input.id])
          break
        case "team":
        case "contributor":
          await requireMemberOf(ctx, "projectMember", [input.id])
          break
        case "form":
          await requireFormOwner(ctx, [input.id])
          break
      }
    } catch {
      return undefined
    }

    switch (input.type) {
      case "project":
        return (await db.project.findUnique({ where: { id: input.id }, select: { name: true } }))
          ?.name

      case "task":
        return (await db.task.findUnique({ where: { id: input.id }, select: { name: true } }))?.name

      case "milestone":
        return (await db.milestone.findUnique({ where: { id: input.id }, select: { name: true } }))
          ?.name

      case "team":
        return (
          await db.projectMember.findUnique({
            where: { id: input.id },
            select: { name: true },
          })
        )?.name

      case "form": {
        const latestVersion = await db.formVersion.findFirst({
          where: { formId: input.id },
          orderBy: { version: "desc" },
          select: { name: true },
        })
        return latestVersion?.name
      }

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
