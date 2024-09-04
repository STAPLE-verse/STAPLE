import { resolver } from "@blitzjs/rpc"
import db, { ContributorPrivileges, WidgetSize } from "db"
import { z } from "zod"

const addProjectManagerWidgetsProps = z.object({
  userId: z.number(),
  projectId: z.number(),
})

export default resolver.pipe(
  resolver.zod(addProjectManagerWidgetsProps),
  resolver.authorize(),
  async ({ userId, projectId }) => {
    const widgetData = [
      {
        userId,
        projectId,
        type: "FormNumber",
        show: true,
        position: 7,
        size: WidgetSize.SMALL,
        privilege: [ContributorPrivileges.PROJECT_MANAGER],
      },
      {
        userId,
        projectId,
        type: "ElementSummary",
        show: true,
        position: 9,
        size: WidgetSize.SMALL,
        privilege: [ContributorPrivileges.PROJECT_MANAGER],
      },
      {
        userId,
        projectId,
        type: "LabelsSummary",
        show: true,
        position: 10,
        size: WidgetSize.SMALL,
        privilege: [ContributorPrivileges.PROJECT_MANAGER],
      },
    ]

    await db.projectWidget.createMany({
      data: widgetData,
    })
  }
)
