import { resolver } from "@blitzjs/rpc"
import db from "db"

interface GetProlificContributorsInput {
  projectId: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ projectId }: GetProlificContributorsInput) => {
    // Fetch contributors including their tasks, filtered by projectId
    const contributors = await db.contributor.findMany({
      where: { projectId: projectId },
      include: {
        tasks: {
          where: {
            status: "COMPLETED",
          },
        },
        user: true,
      },
    })

    // Filter and count completed tasks for each contributor, then sort
    const contributorsWithCompletedTasks = contributors
      .map((contributor) => ({
        ...contributor,
        completedTasksCount: contributor.tasks.length, // Now directly using the length as tasks are already filtered
      }))
      .sort((a, b) => b.completedTasksCount - a.completedTasksCount)

    // Take the top 3 contributors based on the number of completed tasks
    const topContributors = contributorsWithCompletedTasks.slice(0, 3)

    // Prepare the final result to exclude the tasks property
    return topContributors.map(({ tasks, ...contributor }) => ({
      ...contributor,
      completedTasksCount: contributor.completedTasksCount,
    }))
  }
)
