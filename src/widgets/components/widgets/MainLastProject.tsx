import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getDashboardProjects from "src/projects/queries/getDashboardProjects"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import Widget from "../Widget"
import { GetTableDisplay } from "src/core/components/GetWidgetDisplay"
import { projectColumns } from "../ColumnHelpers"
import { useTranslation } from "react-i18next"

const LastProject: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const [{ projects }] = useQuery(getDashboardProjects, undefined)
  const { t } = (useTranslation as any)()
  return (
    <Widget
      title={t("main.dashboard.lastupdatedprojects")}
      display={<GetTableDisplay data={projects} columns={projectColumns} type={"projects"} />}
      link={
        <PrimaryLink
          route={Routes.ProjectsPage()}
          text={t("main.dashboard.allprojectsbutton")}
          classNames="btn-primary"
        />
      }
      tooltipId="tool-last-project"
      tooltipContent={t("main.dashboard.tooltips.lastupdatedprojects")}
      size={size}
    />
  )
}

export default LastProject
