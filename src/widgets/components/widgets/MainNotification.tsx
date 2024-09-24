import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getLatestUnreadNotifications from "src/notifications/queries/getLatestUnreadNotifications"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetNotificationDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"

const MainNotification: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const [{ notifications }] = useQuery(getLatestUnreadNotifications, {})

  return (
    <Widget
      title="Notifications"
      display={<GetNotificationDisplay notifications={notifications} />}
      link={<PrimaryLink route={Routes.NotificationsPage()} text="All Notifications" />}
      tooltipId="tool-notifications"
      tooltipContent="Three recent notifications for all projects"
      size={size}
    />
  )
}

export default MainNotification
