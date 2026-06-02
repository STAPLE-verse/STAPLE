import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CopyProjectSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CopyProjectSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const userId = ctx.session.userId

    const original = await db.project.findFirstOrThrow({
      where: { id },
      include: {
        containers: true,
        milestones: {
          include: { children: { select: { id: true } } },
        },
        roles: true,
        elements: {
          include: { children: { select: { id: true } } },
        },
        tasks: {
          include: { roles: { select: { id: true } } },
        },
      },
    })

    const newProject = await db.project.create({
      data: {
        name: `${original.name} (Copy)`,
        description: original.description,
        formVersionId: original.formVersionId ?? undefined,
      },
    })

    // Containers (kanban columns)
    const containerIdMap = new Map<number, number>()
    for (const container of original.containers) {
      const newContainer = await db.kanbanBoard.create({
        data: {
          name: container.name,
          containerOrder: container.containerOrder,
          projectId: newProject.id,
        },
      })
      containerIdMap.set(container.id, newContainer.id)
    }

    // Milestones (create first, then wire up parent/child)
    const milestoneIdMap = new Map<number, number>()
    for (const milestone of original.milestones) {
      const newMilestone = await db.milestone.create({
        data: {
          name: milestone.name,
          description: milestone.description,
          projectId: newProject.id,
          tags: milestone.tags ?? undefined,
          startDate: milestone.startDate ?? undefined,
          endDate: milestone.endDate ?? undefined,
        },
      })
      milestoneIdMap.set(milestone.id, newMilestone.id)
    }
    for (const milestone of original.milestones) {
      if (milestone.children.length === 0) continue
      const newChildIds = milestone.children
        .map((c) => milestoneIdMap.get(c.id))
        .filter((cid): cid is number => cid !== undefined)
      await db.milestone.update({
        where: { id: milestoneIdMap.get(milestone.id)! },
        data: { children: { connect: newChildIds.map((cid) => ({ id: cid })) } },
      })
    }

    // Roles
    const roleIdMap = new Map<number, number>()
    for (const role of original.roles) {
      const newRole = await db.role.create({
        data: {
          name: role.name,
          description: role.description,
          taxonomy: role.taxonomy,
          projectId: newProject.id,
          userId,
        },
      })
      roleIdMap.set(role.id, newRole.id)
    }

    // Elements (create first, then wire up parent/child)
    const elementIdMap = new Map<number, number>()
    for (const element of original.elements) {
      const newElement = await db.element.create({
        data: {
          name: element.name,
          description: element.description,
          projectId: newProject.id,
        },
      })
      elementIdMap.set(element.id, newElement.id)
    }
    for (const element of original.elements) {
      if (element.children.length === 0) continue
      const newChildIds = element.children
        .map((c) => elementIdMap.get(c.id))
        .filter((cid): cid is number => cid !== undefined)
      await db.element.update({
        where: { id: elementIdMap.get(element.id)! },
        data: { children: { connect: newChildIds.map((cid) => ({ id: cid })) } },
      })
    }

    // ProjectMember and ProjectPrivilege for current user
    const projectMember = await db.projectMember.create({
      data: {
        projectId: newProject.id,
        users: { connect: { id: userId } },
      },
    })
    await db.projectPrivilege.create({
      data: { projectId: newProject.id, userId },
    })

    // Tasks
    for (const task of original.tasks) {
      const newContainerId = containerIdMap.get(task.containerId)
      if (!newContainerId) continue

      const newRoleIds = task.roles
        .map((r) => roleIdMap.get(r.id))
        .filter((rid): rid is number => rid !== undefined)

      await db.task.create({
        data: {
          name: task.name,
          description: task.description,
          deadline: task.deadline ?? undefined,
          startDate: task.startDate ?? undefined,
          tags: task.tags ?? undefined,
          containerTaskOrder: task.containerTaskOrder,
          containerId: newContainerId,
          projectId: newProject.id,
          milestoneId: task.milestoneId ? milestoneIdMap.get(task.milestoneId) : undefined,
          formVersionId: task.formVersionId ?? undefined,
          status: "NOT_COMPLETED",
          autoAssignNew: task.autoAssignNew,
          anonymous: task.anonymous,
          anonymousResponses: task.anonymousResponses,
          elementId: task.elementId ? elementIdMap.get(task.elementId) : undefined,
          createdById: projectMember.id,
          roles:
            newRoleIds.length > 0 ? { connect: newRoleIds.map((rid) => ({ id: rid })) } : undefined,
        },
      })
    }

    return newProject
  }
)
