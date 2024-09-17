import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Status } from "db"
import { z } from "zod"
import { AssignmentStatus } from "db"

const GetProjectStatsSchema = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetProjectStatsSchema),
  resolver.authorize(),
  async ({ id }) => {
    const allTask = await db.task.count({
      where: { projectId: id },
    })

    const allProjectMember = await db.projectMember.count({
      where: { projectId: id },
    })

    const allTeams = await db.team.count({
      where: { projectId: id },
    })

    const completedTask = await db.task.count({
      where: {
        projectId: id,
        status: Status.COMPLETED,
      },
    })

    const allElements = await db.element.count({
      where: {
        projectId: id,
      },
    })

    const assignmentForms = await db.task.findMany({
      where: {
        projectId: id,
        formVersionId: { not: null },
      },
      include: { assignees: { include: { statusLogs: true } } },
    })

    // all assignments that have a schema required
    const allAssignments = assignmentForms.flatMap((task) => task.assignees)

    // not completed assignments with schema
    const completedAssignments = allAssignments.filter(
      (assignment) => assignment.statusLogs[0]?.status === AssignmentStatus.COMPLETED
    )

    // no roles for projectMembers
    const contribRoles = await db.projectMember.findMany({
      where: {
        projectId: id,
      },
      include: { roles: true },
    })

    const completedContribRoles = contribRoles.filter((role) => role.roles.length > 0)

    // no roles for tasks
    const taskRoles = await db.task.findMany({
      where: {
        projectId: id,
      },
      include: { roles: true },
    })

    const completedTaskRoles = taskRoles.filter((role) => role.roles.length > 0)

    return {
      allProjectMember: allProjectMember,
      allTask: allTask,
      completedTask: completedTask,
      allTeams: allTeams,
      allElements: allElements,
      completedContribRoles: completedContribRoles.length,
      completedTaskRoles: completedTaskRoles.length,
      allAssignments: allAssignments.length,
      completedAssignments: completedAssignments.length,
    }
  }
)
