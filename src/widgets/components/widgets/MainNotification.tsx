import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getLatestUnreadNotifications from "src/notifications/queries/getLatestUnreadNotifications"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import Widget from "../Widget"
import {
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  FolderOpenIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline"

const MainNotification: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const [{ notifications, countsByType }] = useQuery(getLatestUnreadNotifications, {})

  return (
    <Widget
      title="Notifications"
      display={
        <div className="flex justify-around gap-4">
          {["Task", "Comment", "Project", "Other"].map((type) => (
            <div key={type} className="flex flex-col items-center relative">
              <div className="relative h-10 w-10 text-primary">
                {type === "Task" && <ClipboardDocumentListIcon className="h-10 w-10" />}
                {type === "Comment" && <ChatBubbleLeftRightIcon className="h-10 w-10" />}
                {type === "Project" && <FolderOpenIcon className="h-10 w-10" />}
                {type === "Other" && <BellAlertIcon className="h-10 w-10" />}
                {countsByType[type]! > 0 && (
                  <span className="absolute top-0 -right-2 badge badge-primary text-xs">
                    {countsByType[type]}
                  </span>
                )}
              </div>
              <div className="text-xl mt-2 font-medium">{type}</div>
            </div>
          ))}
        </div>
      }
      link={
        <PrimaryLink
          route={Routes.NotificationsPage()}
          text="All Notifications"
          classNames="btn-primary"
        />
      }
      tooltipId="tool-notifications"
      tooltipContent="Number of notifications all projects"
      size={size}
    />
  )
}

export default MainNotification
