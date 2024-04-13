import { resolver } from "@blitzjs/rpc"
import db from "db"

interface GetLatestAssignmentStatusInput {
  assignmentId: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ assignmentId }: GetLatestAssignmentStatusInput) => {
    const latestAssignmentStatus = await db.assignmentStatusLog.findFirst({
      where: {
        assignmentId: assignmentId,
      },
      orderBy: {
        changedAt: "desc",
      },
    })

    return latestAssignmentStatus
  }
)
