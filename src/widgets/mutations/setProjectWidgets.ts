import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const SetProjectWidgets = z.object({
  userId: z.number(),
  projectId: z.number(),
})

export default resolver.pipe(
  resolver.zod(SetProjectWidgets),
  resolver.authorize(),
  async ({ userId, projectId }) => {
    const widgetTypes = [
      "ProjectSummary", //overall project information and announcements
      "OverdueTask", //overdue
      "UpcomingTask", // upcoming
      "Notifications", // Notifications
      "ContributorNumber", // number of Contributors
      "TeamNumber", // number of Teams
      "FormNumber", // number of metadata
      "TaskTotal", // number of completed tasks
      "ElementSummary", // number of elements and tasks
      "LabelsSummary", // number of labels and how much they have of each
    ]

    const widgets = widgetTypes.map((type, index) => ({
      userId: userId,
      projectId: projectId,
      type: type,
      show: true,
      position: index + 1,
    }))

    await db.projectWidget.createMany({
      data: widgets,
    })

    return widgets
  }
)
