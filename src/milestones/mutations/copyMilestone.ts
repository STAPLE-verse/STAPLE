import { resolver } from "@blitzjs/rpc"
import db from "db"
import { NotFoundError } from "blitz"
import { CopyMilestoneSchema } from "../schemas"
import { requireManagerOf } from "src/projectprivileges/utils/requireAccess"
import { TASK_COPY_INCLUDE, taskCopyData } from "src/tasks/utils/taskCopyData"

// Makes a copy of a milestone in the same project: name (with " (Copy)"), description, tags and
// dates.
//
// By default its tasks stay with the original, because a task can belong to only one milestone.
// With `includeTasks` the milestone's tasks are copied too, as new tasks under the copy (the same
// way copying a whole project copies tasks): same details, form, roles, column and settings,
// back to "not completed", and with nobody assigned and no responses or comments, so a copy
// never carries someone else's progress or sends anyone a notification.
export default resolver.pipe(
  resolver.zod(CopyMilestoneSchema),
  resolver.authorize(),
  async ({ id, includeTasks = false }, ctx) => {
    await requireManagerOf(ctx, "milestone", [id])
    const userId = ctx.session.userId as number

    const original = await db.milestone.findUniqueOrThrow({
      where: { id },
      include: includeTasks
        ? { task: { include: { roles: { select: { id: true } } } } }
        : undefined,
    })

    return db.$transaction(async (tx) => {
      const copy = await tx.milestone.create({
        data: {
          name: `${original.name} (Copy)`,
          description: original.description,
          projectId: original.projectId,
          tags: original.tags ?? undefined,
          startDate: original.startDate ?? undefined,
          endDate: original.endDate ?? undefined,
        },
      })

      let copiedTaskCount = 0
      const tasks = includeTasks ? (original as any).task ?? [] : []
      if (tasks.length > 0) {
        // the copied tasks are "created by" the person copying, who is a member of this project
        const me = await tx.projectMember.findFirst({
          where: { projectId: original.projectId, name: null, users: { some: { id: userId } } },
          select: { id: true },
        })
        if (!me) throw new NotFoundError()

        // new tasks go to the end of their column
        const nextOrder = new Map<number, number>()
        for (const task of tasks) {
          if (!nextOrder.has(task.containerId)) {
            nextOrder.set(
              task.containerId,
              await tx.task.count({ where: { containerId: task.containerId } })
            )
          }
          const order = nextOrder.get(task.containerId)!
          nextOrder.set(task.containerId, order + 1)

          await tx.task.create({
            data: taskCopyData(task, {
              projectId: original.projectId,
              milestoneId: copy.id,
              containerTaskOrder: order,
              createdById: me.id,
            }),
          })
          copiedTaskCount += 1
        }
      }

      return { ...copy, copiedTaskCount }
    })
  }
)
