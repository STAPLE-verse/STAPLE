import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ id }) => {
  // Adding main dashboard default widgets
  const widgetTypes = ["LastProject", "OverdueTask", "UpcomingTask", "Notifications"]

  const widgets = widgetTypes.map((type, index) => ({
    userId: id,
    type: type,
    show: true,
    position: index + 1,
  }))

  await db.widget.createMany({
    data: widgets,
  })
})
