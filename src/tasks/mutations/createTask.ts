import { resolver } from "@blitzjs/rpc"
import db, { CompletedAs } from "db"
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
    deadline,
    createdById,
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
        deadline,
        project: {
          connect: { id: projectId },
        },
        column: {
          connect: { id: columnId },
        },
        createdBy: {
          connect: { id: createdById },
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
    if (contributorsId != null && contributorsId.length != 0) {
      contributorsId.forEach(async (contributorId) => {
        // Create the assignment
        const assignment = await db.assignment.create({
          data: {
            task: { connect: { id: task.id } },
            contributor: { connect: { id: contributorId } },
          },
        })
        // Create assignment status log
        await db.assignmentStatusLog.create({
          data: {
            assignmentId: assignment.id,
          },
        })
      })
    }

    if (teamsId != null && teamsId.length != 0) {
      teamsId.forEach(async (teamId) => {
        // Create the assignment
        const assignment = await db.assignment.create({
          data: {
            task: { connect: { id: task.id } },
            team: { connect: { id: teamId } },
          },
        })
        // Create assignment status log
        await db.assignmentStatusLog.create({
          data: {
            assignmentId: assignment.id,
            completedAs: CompletedAs.TEAM,
          },
        })
      })
    }

    return task
  }
)
