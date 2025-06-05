import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getLatestUnreadNotifications from "src/notifications/queries/getLatestUnreadNotifications"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetTableDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { notificationColumns } from "../ColumnHelpers"
import { useTranslation } from "react-i18next"

const MainNotification: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const [{ notifications }] = useQuery(getLatestUnreadNotifications, {})

  const { t } = (useTranslation as any)()
  return (
    <Widget
      title={t("main.dashboard.notifications")}
      display={
        <GetTableDisplay
          data={notifications}
          columns={notificationColumns}
          type={"unread notifications"}
        />
      }
      link={
        <PrimaryLink
          route={Routes.NotificationsPage()}
          text={t("main.dashboard.allnotificationsbutton")}
          classNames="btn-primary"
        />
      }
      tooltipId="tool-notifications"
      tooltipContent={t("main.dashboard.tooltips.notifications")}
      size={size}
    />
  )
}

export default MainNotification
