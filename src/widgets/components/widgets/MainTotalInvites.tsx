import React from "react"
import { useQuery } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import PrimaryLink from "src/core/components/PrimaryLink"
import { GetIconDisplay } from "src/core/components/GetWidgetDisplay"
import Widget from "../Widget"
import { EnvelopeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getInvites from "src/invites/queries/getInvites"
import { useTranslation } from "react-i18next"

const TotalInvites: React.FC<{ size: "SMALL" | "MEDIUM" | "LARGE" }> = ({ size }) => {
  const currentUser = useCurrentUser()
  // Get invitations
  const [invites] = useQuery(getInvites, {
    where: { email: currentUser!.email },
    orderBy: { id: "asc" },
  })
  const { t } = (useTranslation as any)()
  return (
    <Widget
      title={t("main.dashboard.invites")}
      display={<GetIconDisplay number={invites.length} icon={EnvelopeIcon} />}
      link={
        <PrimaryLink
          route={Routes.InvitesPage()}
          text={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
          classNames="btn-ghost"
        />
      }
      tooltipId="tool-invites-total"
      tooltipContent={t("main.dashboard.tooltips.invites")}
      size={size}
    />
  )
}

export default TotalInvites
