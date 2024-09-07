import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import Table from "src/core/components/Table"
import useContributorAuthorization from "src/contributors/hooks/UseContributorAuthorization"
import { ContributorPrivileges } from "@prisma/client"
import getInvites from "src/invites/queries/getInvites"
import { inviteTableColumnsPM } from "src/invites/components/InvitesTable"

export const AllInvitesList = () => {
  const projectId = useParam("projectId", "number")
  const [invites] = useQuery(getInvites, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
  })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
      <Table columns={inviteTableColumnsPM} data={invites} addPagination={true} />
    </main>
  )
}
// issue 37
const InvitesPagePM = () => {
  const projectId = useParam("projectId", "number")
  useContributorAuthorization([ContributorPrivileges.PROJECT_MANAGER])

  return (
    <Layout>
      <Head>
        <title>Project Contributor Invitations</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Invited Contributors</h1>

        <Suspense fallback={<div>Loading...</div>}>
          <AllInvitesList />
        </Suspense>
        <div>
          <Link
            className="btn btn-primary mb-4"
            href={Routes.NewContributorPage({ projectId: projectId! })}
          >
            Invite Contributor
          </Link>

          <Link
            className="btn btn-secondary mx-2 mb-4"
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
