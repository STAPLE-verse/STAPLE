import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTaskSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateTaskSchema),
  resolver.authorize(),
  async ({ projectId, columnId, name, description, elementId, contributorId, schema }) => {
    // Get number of tasks for the column inside the project
    const columnTaskIndex = await db.task.count({
      where: {
        projectId: projectId, // Filter tasks by projectId
        columnId: columnId, // Filter tasks by columnId
      },
    })

    const task = await db.task.create({
      data: {
        name,
        description,
        columnTaskIndex,
        schema,
        project: {
          connect: { id: projectId },
        },
        column: {
          connect: { id: columnId },
        },
        // TODO: check if this is a good way to conditionally add relation
        element: elementId
          ? {
              connect: { id: elementId },
            }
          : undefined,
      },
    })

    // Create the assignment
    if (contributorId) {
      const assignment = await db.assignment.create({
        data: {
          task: { connect: { id: task.id } },
          contributor: { connect: { id: contributorId } },
        },
      })
    }

    return task
  }
)
