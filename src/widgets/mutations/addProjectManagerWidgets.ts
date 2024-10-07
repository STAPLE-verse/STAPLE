import { resolver } from "@blitzjs/rpc"
import db, { MemberPrivileges, WidgetSize } from "db"
import { z } from "zod"

const addProjectManagerWidgetsProps = z.object({
  userId: z.number(),
  projectId: z.number(),
})

export default resolver.pipe(
  resolver.zod(addProjectManagerWidgetsProps),
  resolver.authorize(),
  async ({ userId, projectId }) => {
    // Check if the user already has the PROJECT_MANAGER privilege
    const existingPrivilege = await db.projectPrivilege.findFirst({
      where: {
        userId: userId,
        projectId: projectId,
        privilege: MemberPrivileges.PROJECT_MANAGER,
      },
    })

    // If the user is already a project manager, return early
    if (existingPrivilege) {
      console.log("User is already a project manager. No widgets will be added.")
      return
    }

    const widgetData = [
      {
        userId,
        projectId,
        type: "FormNumber",
        show: true,
        position: 7,
        size: WidgetSize.SMALL,
        privilege: [MemberPrivileges.PROJECT_MANAGER],
      },
      {
        userId,
        projectId,
        type: "ElementSummary",
        show: true,
        position: 9,
        size: WidgetSize.SMALL,
        privilege: [MemberPrivileges.PROJECT_MANAGER],
      },
      {
        userId,
        projectId,
        type: "RolesSummary",
        show: true,
        position: 10,
        size: WidgetSize.SMALL,
        privilege: [MemberPrivileges.PROJECT_MANAGER],
      },
    ]

    await db.projectWidget.createMany({
      data: widgetData,
    })
  }
)
