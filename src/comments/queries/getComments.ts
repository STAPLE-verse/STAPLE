import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Prisma } from "db"
import { CommentWithAuthor } from "src/core/types"

interface GetCommentsInput
  extends Pick<Prisma.CommentFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take }: GetCommentsInput): Promise<CommentWithAuthor[]> => {
    const comments = await db.comment.findMany({
      where,
      orderBy: orderBy || { createdAt: "asc" }, // Default ordering by creation date
      skip,
      ...(typeof take === "number" ? { take } : {}),
      include: {
        author: {
          include: {
            users: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        commentReadStatus: true,
      },
    })

    return comments
  }
)
