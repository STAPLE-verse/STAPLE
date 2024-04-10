import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateAssignmentSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateAssignmentSchema),
  resolver.authorize(),
  async ({ id, metadata, status, completedBy, completedAs }) => {
    const assignmentStatusLog = await db.assignmentStatusLog.create({
      data: {
        assignmentId: id,
        metadata,
        status,
        completedBy,
        completedAs,
      },
    })

    return assignmentStatusLog
  }
)
