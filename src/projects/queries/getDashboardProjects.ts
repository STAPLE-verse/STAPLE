import { ProjectWithNewCommentsCount } from "src/core/types"
import { Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import getProjects from "./getProjects"

export default resolver.pipe(resolver.authorize(), async (undefined, ctx: Ctx) => {
  const { projects } = await getProjects(
    {
      where: {
        projectMembers: {
          some: {
            users: {
              some: { id: ctx.session.userId as number },
            },
            deleted: false,
          },
        },
      },
      orderBy: { updatedAt: "asc" },
      take: 3,
      include: {
        tasks: {
          where: {
            taskLogs: {
              some: {
                assignedTo: {
                  id: ctx.session.userId as number,
                },
              },
            },
          },
          include: {
            taskLogs: {
              include: {
                comments: {
                  include: {
                    commentReadStatus: {
                      where: {
                        read: false,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    ctx
  )

  return {
    projects: projects.map((project: ProjectWithNewCommentsCount) => {
      const newCommentsCount = project.tasks.reduce((acc, task) => {
        return (
          acc +
          task.taskLogs.reduce((logAcc, log) => {
            return (
              logAcc +
              log.comments.reduce((commentAcc, comment) => {
                return commentAcc + (comment.commentReadStatus?.length || 0)
              }, 0)
            )
          }, 0)
        )
      }, 0)

      return {
        ...project,
        newCommentsCount,
      }
    }),
  }
})
