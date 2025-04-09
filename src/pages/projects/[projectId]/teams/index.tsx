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

  const tableColumns =
    privilege === MemberPrivileges.CONTRIBUTOR ? ContributorTeamColumns : PmTeamColumns

  return (
    <div>
      <Table columns={tableColumns} data={teamData} addPagination={true} />
    </div>
  )
}

// Issue 37
const TeamsPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()

  return (
    <Layout title="All Teams">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Teams</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <AllTeamList privilege={privilege!} projectId={projectId} />
        </Suspense>
        {privilege === MemberPrivileges.PROJECT_MANAGER && (
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
