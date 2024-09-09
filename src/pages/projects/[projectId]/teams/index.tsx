import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import getTeams from "src/teams/queries/getTeams"
import {
  TeamInformation,
  contributorTeamTableColumns,
  pmTeamTableColumns,
} from "src/teams/components/TeamTable"
import Table from "src/core/components/Table"
import { useContributorPrivilege } from "src/contributors/components/ContributorPrivilegeContext"
import { ContributorPrivileges } from "@prisma/client"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"

interface AllTeamListProps {
  privilege: ContributorPrivileges
}

export const AllTeamList = ({ privilege }: AllTeamListProps) => {
  const projectId = useParam("projectId", "number")
  const { contributor: currentContributor } = useCurrentContributor(projectId)

  type TeamWithContributors = {
    id: number
    contributors: { id: number }[] // Adjust based on actual contributor fields
    // Add any other fields on the team you expect
  }

  const [{ teams }] = useQuery(getTeams, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    include: {
      contributors: true, // Ensure that contributors are included
    },
  })

  // Filter teams if the privilege is CONTRIBUTOR
  // Now explicitly type the teams to avoid the error
  const filteredTeams =
    privilege === ContributorPrivileges.CONTRIBUTOR
      ? (teams as TeamWithContributors[]).filter((team) =>
          team.contributors.some((contributor) => contributor.id === currentContributor?.id)
        )
      : teams

  let teamInformation: TeamInformation[] = filteredTeams.map((team) => {
    let t: TeamInformation = {
      name: team.name,
      id: team.id,
      projectId: projectId,
    }
    return t
  })

  const tableColumns =
    privilege === ContributorPrivileges.CONTRIBUTOR
      ? contributorTeamTableColumns
      : pmTeamTableColumns

  return (
    <div>
      <Table columns={tableColumns} data={teamInformation} addPagination={true} />
    </div>
  )
}

// Issue 37
const TeamsPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useContributorPrivilege()

  return (
    <Layout>
      <Head>
        <title>All Teams</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Teams</h1>

        {
          <Suspense fallback={<div>Loading...</div>}>
            <AllTeamList privilege={privilege!} />
          </Suspense>
        }
        {privilege === ContributorPrivileges.PROJECT_MANAGER && (
          <div>
            <Link
              className="btn btn-primary mb-4 mt-4"
              href={Routes.NewTeamPage({ projectId: projectId! })}
            >
              Add Team
            </Link>
          </div>
        )}
      </main>
    </Layout>
  )
}

export default TeamsPage
