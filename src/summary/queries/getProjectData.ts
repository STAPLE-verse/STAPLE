import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetProjectData = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetProjectData), resolver.authorize(), async ({ id }) => {
  const project = await db.project.findFirst({
    where: { id },
    select: {
      // project timestamps
      createdAt: true,
      updatedAt: true,
      // project metadata
      name: true,
      description: true,
      abstract: true,
      keywords: true,
      citation: true,
      publisher: true,
      identifier: true,
      // relations we want
      tasks: {
        select: {
          // task timestamps
          createdAt: true,
          updatedAt: true,
          // createdBy & createdById
          createdById: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              deleted: true,
              users: {
                select: {
                  institution: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          // metadata
          deadline: true,
          startDate: true,
          name: true,
          description: true,
          status: true,
          // needed for anonymization downstream
          anonymous: true,
          // relations on task
          milestone: {
            select: {
              createdAt: true,
              updatedAt: true,
              name: true,
              description: true,
              startDate: true,
              endDate: true,
              // include minimal for back reference tasks is omitted to avoid cycles
            },
          },
          formVersion: {
            select: {
              name: true,
              schema: true,
              uiSchema: true,
              createdAt: true,
              // keep relations shallow to avoid huge payloads
            },
          },
          taskLogs: {
            select: {
              createdAt: true,
              status: true,
              metadata: true,
              completedAs: true,
              assignedTo: {
                select: {
                  id: true,
                  name: true,
                  deleted: true,
                },
              },
              completedBy: {
                select: {
                  id: true,
                  name: true,
                  deleted: true,
                },
              },
            },
          },
          roles: {
            select: {
              id: true,
              name: true,
              description: true,
              taxonomy: true,
            },
          },
        },
      },
      milestones: {
        select: {
          createdAt: true,
          updatedAt: true,
          name: true,
          description: true,
          startDate: true,
          endDate: true,
          // tasks of this milestone (ids only to prevent bloat)
          task: {
            select: {
              id: true,
            },
          },
        },
      },
      projectMembers: {
        // "keep project members like I have it"
        select: {
          id: true,
          name: true,
          deleted: true,
          users: {
            select: {
              institution: true,
              username: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          roles: {
            select: { id: true, name: true, description: true, taxonomy: true },
          },
        },
      },
      metadata: true,
      formVersion: {
        select: {
          name: true,
          schema: true,
          uiSchema: true,
          createdAt: true,
          // omit form, tasks, projects to avoid recursion unless needed later
        },
      },
    },
  })

  if (!project) throw new NotFoundError()
  return project
})
