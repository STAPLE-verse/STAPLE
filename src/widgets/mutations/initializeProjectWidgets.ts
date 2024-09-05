import { resolver } from "@blitzjs/rpc"
import db, { WidgetSize } from "db"
import { z } from "zod"

const SetProjectWidgets = z.object({
  userId: z.number(),
  projectId: z.number(),
})

export default resolver.pipe(
  resolver.zod(SetProjectWidgets),
  resolver.authorize(),
  async ({ userId, projectId }) => {
    const widgetData = [
      {
        userId,
        projectId,
        type: "ProjectSummary",
        show: true,
        position: 1,
        size: WidgetSize.LARGE,
      },
      {
        userId,
        projectId,
        type: "OverdueTask",
        show: true,
        position: 2,
        size: WidgetSize.LARGE,
      },
      {
        userId,
        projectId,
        type: "UpcomingTask",
        show: true,
        position: 3,
        size: WidgetSize.LARGE,
      },
      {
        userId,
        projectId,
        type: "Notifications",
        show: true,
        position: 4,
        size: WidgetSize.LARGE,
      },
      {
        userId,
        projectId,
        type: "ContributorNumber",
        show: true,
        position: 5,
        size: WidgetSize.SMALL,
      },
      {
        userId,
        projectId,
        type: "TeamNumber",
        show: true,
        position: 6,
        size: WidgetSize.SMALL,
      },
      {
        userId,
        projectId,
        type: "FormNumber",
        show: true,
        position: 7,
        size: WidgetSize.SMALL,
      },
      {
        userId,
        projectId,
        type: "TaskTotal",
        show: true,
        position: 8,
        size: WidgetSize.SMALL,
      },
      {
        userId,
        projectId,
        type: "ElementSummary",
        show: true,
        position: 9,
        size: WidgetSize.SMALL,
      },
      {
        userId,
        projectId,
        type: "LabelsSummary",
        show: true,
        position: 10,
        size: WidgetSize.SMALL,
      },
    ]

    const createdWidgets = await Promise.all(
      widgetData.map((widget) => db.projectWidget.create({ data: widget }))
    )

    return createdWidgets
  }
)
