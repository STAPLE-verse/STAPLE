import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getNotifications from "src/notifications/queries/getNotifications"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetNotificationDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const ProjectNotification = () => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

  // Fetch notifications for the project
  const [{ notifications }] = useQuery(getNotifications, {
    where: {
      recipients: { some: { id: currentUser!.id } },
      projectId: projectId,
      read: false,
    },
    orderBy: { id: "desc" },
    take: 3,
  })

  return (
    <Widget
      title="Notifications"
      display={<GetNotificationDisplay notifications={notifications} />}
      link={
        <PrimaryLink
          route={Routes.ProjectNotificationsPage({ projectId: projectId! })}
          text="Project Notifications"
        />
      }
      tooltipId="tool-notification"
      tooltipContent="Three notifications for this project"
    />
  )
}

export default ProjectNotification
