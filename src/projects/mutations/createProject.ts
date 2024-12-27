import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProjectSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateProjectSchema),
  resolver.authorize(),
  async ({ name, description, formVersionId }, ctx) => {
    const userId = ctx.session.userId
    const project = await db.project.create({
      data: {
        // Inputs from project creation form
        name,
        description,
        formVersion: formVersionId
          ? {
              connect: { id: formVersionId },
            }
          : undefined,
        // Initialize project with "To Do", "In Progress", "Done" kanban board columns
        containers: {
          create: [
            {
              name: "To Do",
              containerOrder: 0,
            },
            {
              name: "In Progress",
              containerOrder: 1,
            },
            {
              name: "Done",
              containerOrder: 2,
            },
          ],
        },
      },
      include: {
        containers: true,
      },
    })

    // Create project member row for "individuals"
    const projectMember = await db.projectMember.create({
      data: {
        projectId: project.id,
        users: {
          connect: { id: userId }, // Connect an existing user to the project member
        },
      },
    })

    // Create project privileges
    await db.projectPrivilege.create({
      data: {
        projectId: project.id,
        userId: userId,
      },
    })

    const firstContainerId = project.containers
      .filter((container) => container.projectId === project.id) // Ensure it's tied to the created project
      .find((container) => container.containerOrder === 0)?.id

    // Create a do this task
    const task = await db.task.create({
      data: {
        name: "Complete Project Description Form",
        project: {
          connect: { id: project.id },
        },
        containerTaskOrder: 0, // has to be first only one
        container: {
          connect: { id: firstContainerId }, // put it in default to do
        },
        description: "Here's a real description to come",
        createdBy: {
          connect: { id: projectMember.id },
        },
        assignedMembers: {
          connect: { id: projectMember.id },
        },
      },
    })

    // create the task log or you will blow this up
    await db.taskLog.create({
      data: {
        task: { connect: { id: task.id } },
        assignedTo: { connect: { id: projectMember.id } },
        completedAs: "INDIVIDUAL",
      },
    })

    return project
  }
)
