import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTaskSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateTaskSchema),
  resolver.authorize(),
  async ({
    projectId,
    columnId,
    name,
    description,
    elementId,
    contributorsId,
    teamsId,
    schema,
  }) => {
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
    if (contributorsId != null) {
      contributorsId.forEach(async (contributorId) => {
        const assignment = await db.assignment.create({
          data: {
            task: { connect: { id: task.id } },
            contributor: { connect: { id: contributorId } },
          },
        })
      })
    }

    if (teamsId != null) {
      teamsId.forEach(async (teamId) => {
        const assignment = await db.assignment.create({
          data: {
            task: { connect: { id: task.id } },
            team: { connect: { id: teamId } },
          },
        })
      })
    }

    return task
  }
)
