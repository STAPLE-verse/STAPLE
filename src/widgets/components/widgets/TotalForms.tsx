import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetIconDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { BeakerIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getForms from "src/forms/queries/getForms"
import { useTranslation } from "react-i18next"

const TotalForms: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const currentUser = useCurrentUser()
  // Get forms
  const [forms] = useQuery(getForms, {
    where: {
      user: { id: currentUser?.id },
      archived: false,
    },
    orderBy: { id: "asc" },
  })
  const { t } = (useTranslation as any)()
  return (
    <Widget
      title={t("main.dashboard.forms")}
      display={<GetIconDisplay number={forms.length} icon={BeakerIcon} />}
      link={
        <PrimaryLink
          route={Routes.AllFormsPage()}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-form-total"
      tooltipContent={t("main.dashboard.tooltips.forms")}
      size={size}
    />
  )
}

export default TotalForms
