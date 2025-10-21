import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "@prisma/client"
import { AllInvitesList } from "src/invites/components/AllInvitesList"
import { Tooltip } from "react-tooltip"
import { InformationCircleIcon } from "@heroicons/react/24/outline"

// issue 37
const InvitesPagePM = () => {
  const projectId = useParam("projectId", "number")
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Project Contributor Invitations">
      <main className="flex flex-col mx-auto w-full">
        <h1 className="flex justify-center items-center text-3xl">
          Invited Contributors
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="contributors-overview"
          />
          <Tooltip
            id="contributors-overview"
            content="On this page, you can view the invitations for contributors. Give the contributor the invite code if they want to add the project but do not see the invitation. "
            className="z-[1099] ourtooltips"
          />
        </h1>

        <div className="flex justify-center items-center">
          <Link
            className="btn btn-primary mb-2 mt-4"
            href={Routes.NewContributorPage({ projectId: projectId! })}
          >
            Invite Contributor(s)
          </Link>

          <Link
            className="btn btn-secondary mx-2 mb-2 mt-4"
            href={Routes.ContributorsPage({ projectId: projectId! })}
          >
            View Contributors
          </Link>
          <Link
            href={Routes.RoleBuilderPage()}
            className="btn btn-info mb-2 mt-4"
            data-tooltip-id="roles-overview"
          >
            Go to Roles
          </Link>
          <Tooltip
            id="roles-overview"
            content="Set up project roles on the Roles page so you can assign them to contributors. You can add or edit roles later."
            className="z-[1099] ourtooltips"
          />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <AllInvitesList />
        </Suspense>
      </main>
    </Layout>
  )
}

export default InvitesPagePM
