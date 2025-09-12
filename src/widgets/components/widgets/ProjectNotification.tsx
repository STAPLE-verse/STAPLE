import React, { useEffect } from "react"
import { eventBus } from "src/core/utils/eventBus"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getNotifications from "src/notifications/queries/getNotifications"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import Widget from "../Widget"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import {
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline"
import { determineNotificationType } from "src/notifications/utils/determineNotificationType"
import Link from "next/link"

const ProjectNotification: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  // Get projectId from the route params
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

  // Fetch notifications for the project
  const [{ notifications }, { refetch }] = useQuery(getNotifications, {
    where: {
      recipients: { some: { id: currentUser!.id } },
      projectId: projectId,
      read: false,
    },
    orderBy: { id: "desc" },
  })

  useEffect(() => {
    const handler = () => refetch()
    eventBus.on("announcementCreated", handler)
    return () => eventBus.off("announcementCreated", handler)
  }, [refetch])

  const countsByType: { [key: string]: number } = {}
  notifications.forEach((n) => {
    const type = determineNotificationType(n.message)
    countsByType[type] = (countsByType[type] || 0) + 1
  })

  return (
    <Widget
      title="Notifications"
      display={
        <div className="flex justify-around gap-6 mt-4">
          {["Task", "Comment", "Project", "Other"].map((type) => (
            <div key={type} className="flex flex-col items-center relative">
              <Link
                href={Routes.ProjectNotificationsPage({ projectId: projectId! })}
                className="relative h-20 w-20 text-primary"
              >
                {type === "Task" && <ClipboardDocumentListIcon className="h-15 w-15" />}
                {type === "Comment" && <ChatBubbleLeftRightIcon className="h-15 w-15" />}
                {type === "Project" && <FolderOpenIcon className="h-15 w-15" />}
                {type === "Other" && <BellAlertIcon className="h-15 w-15" />}
                {countsByType && countsByType[type]! > 0 && (
                  <span className="absolute top-0 -right-2 badge badge-primary text-xs">
                    {countsByType[type]}
                  </span>
                )}
              </Link>
              <div className="text-xl mt-2 font-medium">{type}</div>
            </div>
          ))}
        </div>
      }
      link={
        <PrimaryLink
          route={Routes.ProjectNotificationsPage({ projectId: projectId! })}
          text="Project Notifications"
          classNames="btn-primary"
        />
      }
      tooltipId="tool-notification"
      tooltipContent="Number of notifications for this project, clear them by marking them read."
      size={size}
    />
  )
}

export default ProjectNotification
