import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetFormTotalDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getForms from "src/forms/queries/getForms"

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

  return (
    <Widget
      title="Projects"
      display={<GetFormTotalDisplay forms={forms} />}
      link={
        <PrimaryLink
          route={Routes.AllFormsPage()}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-form-total"
      tooltipContent="Total number of metadata templates"
      size={size}
    />
  )
}

export default TotalForms
