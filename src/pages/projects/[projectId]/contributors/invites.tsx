import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "@prisma/client"
import { AllInvitesList } from "src/invites/components/AllInvitesList"

// issue 37
const InvitesPagePM = () => {
  const projectId = useParam("projectId", "number")
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Project Contributor Invitations">
      <main className="flex flex-col mx-auto w-full">
        <h1 className="flex justify-center mb-2 text-3xl">Invited Contributors</h1>

        <Suspense fallback={<div>Loading...</div>}>
          <AllInvitesList />
        </Suspense>
        <div>
          <Link
            className="btn btn-primary mb-4 mt-4"
            href={Routes.NewContributorPage({ projectId: projectId! })}
          >
            Invite Contributor(s)
          </Link>

          <Link
            className="btn btn-secondary mx-2 mb-4 mt-4"
            href={Routes.ContributorsPage({ projectId: projectId! })}
          >
            View Contributors
          </Link>
        </div>
      </main>
    </Layout>
  )
}

export default InvitesPagePM
