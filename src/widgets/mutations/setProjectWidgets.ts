import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ id, projectId }) => {
  // Adding main dashboard default widgets
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
    userId: id,
    projectId: projectId,
    type: type,
    show: true,
    position: index + 1,
  }))

  await db.projectwidget.createMany({
    data: widgets,
  })
})
