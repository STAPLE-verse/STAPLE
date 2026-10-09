import { resolver } from "@blitzjs/rpc"
import { NotFoundError } from "blitz"
import db from "db"
import { CopyTaskSetSchema } from "../schemas"
import { requireInProject, requireProjectManager } from "src/projectprivileges/utils/requireAccess"
import { TASK_COPY_INCLUDE, taskCopyData } from "../utils/taskCopyData"
import { taskNameForLabel } from "../utils/copyTaskSetInput"

// Copies a set of tasks (for example the steps of a pipeline) once for each label (for example
// each interview or dataset). The tasks are copied in the order they were made, so "do 1, 2, 3, 4"
// stays 1, 2, 3, 4. Each copy is named "<task> - <label>" and is a new, unassigned task, like a
// task copied with its milestone (see taskCopyData). Optionally each copy of the set goes in its
// own new milestone named after the label; otherwise the copies are not in a milestone.
export default resolver.pipe(
  resolver.zod(CopyTaskSetSchema),
  resolver.authorize(),
  async ({ projectId, taskIds, labels, ownMilestones = false }, ctx) => {
    await requireProjectManager(ctx, projectId)
    await requireInProject("task", taskIds, projectId)
    const userId = ctx.session.userId as number

    const uniqueIds = Array.from(new Set(taskIds))
    const originals = await db.task.findMany({
      where: { id: { in: uniqueIds }, projectId },
      include: TASK_COPY_INCLUDE,
      orderBy: { id: "asc" },
    })
    if (originals.length !== uniqueIds.length) throw new NotFoundError()

    return db.$transaction(async (tx) => {
      // the copied tasks are "created by" the person copying, who is a member of this project
      const me = await tx.projectMember.findFirst({
        where: { projectId, name: null, users: { some: { id: userId } } },
        select: { id: true },
      })
      if (!me) throw new NotFoundError()

      // new tasks go to the end of their column
      const nextOrder = new Map<number, number>()
      let taskCount = 0
      let milestoneCount = 0

      for (const label of labels) {
        let milestoneId: number | null = null
        if (ownMilestones) {
          const milestone = await tx.milestone.create({ data: { name: label, projectId } })
          milestoneId = milestone.id
          milestoneCount += 1
        }

        for (const task of originals) {
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
              name: taskNameForLabel(task.name, label),
              projectId,
              milestoneId,
              containerTaskOrder: order,
              createdById: me.id,
            }),
          })
          taskCount += 1
        }
      }

      return { taskCount, milestoneCount }
    })
  }
)
