import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { ContributorTeamColumns } from "src/teams/tables/columns/ContributorTeamColumns"
import { PmTeamColumns } from "src/teams/tables/columns/PmTeamColumns"
import Table from "src/core/components/Table"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { MemberPrivileges } from "@prisma/client"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { processTeam } from "src/teams/tables/processing/processTeam"
import { ProjectMemberWithUsers } from "src/core/types"
import Card from "src/core/components/Card"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

interface AllTeamListProps {
  privilege: MemberPrivileges
  projectId: number | undefined
}

export const AllTeamList = ({ privilege, projectId }: AllTeamListProps) => {
  const currentUser = useCurrentUser()

  const [{ projectMembers }] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      name: { not: null }, // Ensures the name in ProjectMember is non-null
      users: {
        some: { id: { not: undefined } }, // Ensures there's at least one user
      },
      deleted: false, // Do not show deleted teams
    },
    orderBy: { id: "asc" },
    include: {
      users: true, // Ensure that projectMembers are included
    },
  })

  // Filter teams if the privilege is CONTRIBUTOR
  // Now explicitly type the teams to avoid the error
  const teamData = processTeam(
    projectMembers as ProjectMemberWithUsers[],
    privilege,
    currentUser?.id,
    projectId!
  )

  const tableColumnsTeams =
    privilege === MemberPrivileges.CONTRIBUTOR ? ContributorTeamColumns : PmTeamColumns

  return (
    <div>
      <Table columns={tableColumnsTeams} data={teamData} addPagination={true} />
    </div>
  )
}

// Issue 37
const TeamsPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="All Teams">
      <main className="flex flex-col mx-auto w-full">
        <h1 className="flex justify-center items-center mb-2 text-3xl">
          Teams
          <InformationCircleIcon
            className="ml-2 h-5 w-5 stroke-2 text-info"
            data-tooltip-id="team-tooltip"
          />
          <Tooltip
            id="team-tooltip"
            content="Use this page to create new groups of people to work together in teams. Use teams to assign a task to a group of people where only one completion is needed. People can be in more than one team. Use the view button to review team assignments, members, and completions."
            className="z-[1099] ourtooltips"
          />
        </h1>
        {privilege === MemberPrivileges.PROJECT_MANAGER && (
          <div className="flex justify-center mb-2 mt-2">
            <Link className="btn btn-primary" href={Routes.NewTeamPage({ projectId: projectId! })}>
              Add Team
            </Link>
          </div>
        )}
        <Suspense fallback={<div>Loading...</div>}>
          <Card title="">
            <AllTeamList privilege={privilege!} projectId={projectId} />
          </Card>
        </Suspense>
      </main>
    </Layout>
  )
}

export default TeamsPage
