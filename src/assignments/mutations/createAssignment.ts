import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateAssignmentSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateAssignmentSchema),
  resolver.authorize(),
  async ({ taskId, contributorId }) => {
    // Create the assignment
    const assignment = await db.assignment.create({
      data: {
        task: { connect: { id: taskId } },
        contributor: { connect: { id: contributorId } },
      },
    })

    return assignment
  }
)
