import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

// Define the input interface correctly for tasks
interface GetTaskInput extends Pick<Prisma.TaskFindManyArgs, "where" | "orderBy" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include }: GetTaskInput) => {
    return await db.task.findMany({
      where, // Pass filtering criteria
      orderBy: orderBy ?? { createdAt: "desc" }, // Sort by creation date by default
      include, // Include any related models if provided
    })
  }
)
