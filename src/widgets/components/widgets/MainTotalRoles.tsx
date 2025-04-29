import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetIconDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { FingerPrintIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getRoles from "src/roles/queries/getRoles"

const TotalRoles: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const currentUser = useCurrentUser()
  // Get forms
  const [{ roles }] = useQuery(getRoles, {
    where: {
      user: { id: currentUser?.id },
    },
    orderBy: { id: "asc" },
  })

  return (
    <Widget
      title="Roles"
      display={<GetIconDisplay number={roles.length} icon={FingerPrintIcon} />}
      link={
        <PrimaryLink
          route={Routes.RoleBuilderPage()}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-roles-total"
      tooltipContent="Total number of role labels"
      size={size}
    />
  )
}

export default TotalRoles
