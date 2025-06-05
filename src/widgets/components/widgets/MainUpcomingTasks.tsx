import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getDashboardTasks from "src/tasks/queries/getDashboardTasks"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetTableDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { tasksColumns } from "../ColumnHelpers"
import { useTranslation } from "react-i18next"

const MainUpcomingTasks: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }, ctx) => {
  const [{ upcomingTasks }] = useQuery(getDashboardTasks, ctx, {
    suspense: true, // Set to false if you want to handle loading and error states manually
  })
  const { t } = (useTranslation as any)()
  return (
    <Widget
      title={t("main.dashboard.upcomingtask")}
      display={
        <GetTableDisplay data={upcomingTasks} columns={tasksColumns} type={"upcoming tasks"} />
      }
      link={
        <PrimaryLink
          route={Routes.AllTasksPage()}
          text={t("main.dashboard.alltasksbutton")}
          classNames="btn-primary"
        />
      }
      tooltipId="tool-upcoming"
      tooltipContent={t("main.dashboard.tooltips.upcomingtask")}
      size={size}
    />
  )
}

export default MainUpcomingTasks
