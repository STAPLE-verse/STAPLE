import { resolver } from "@blitzjs/rpc"
import db, { WidgetSize } from "db"

export default resolver.pipe(resolver.authorize(), async (userId: number) => {
  // Adding main dashboard default widgets
  const widgetTypes = ["LastProject", "OverdueTask", "UpcomingTask", "Notifications"]

  const widgets = widgetTypes.map((type, index) => ({
    userId: userId,
    type: type,
    show: true,
    position: index + 1,
    size: WidgetSize.LARGE,
  }))

  // Create the widgets
  await db.widget.createMany({
    data: widgets,
  })

  // Retrieve the created widgets
  const createdWidgets = await db.widget.findMany({
    where: { userId },
    orderBy: { position: "asc" },
  })

  return createdWidgets
})
