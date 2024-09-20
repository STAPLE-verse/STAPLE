import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import {
  TeamInformation,
  projectMemberTeamTableColumns,
  pmTeamTableColumns,
} from "src/teams/components/TeamTable"
import Table from "src/core/components/Table"
import { useMemberPrivileges } from "src/projectmembers/components/MemberPrivilegesContext"
import { MemberPrivileges, ProjectMember, User } from "@prisma/client"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

interface AllTeamListProps {
  privilege: MemberPrivileges
}

export type ProjectMemberWithUsers = ProjectMember & {
  users: User[]
}

export const AllTeamList = ({ privilege }: AllTeamListProps) => {
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

  const [{ projectMembers }] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      users: {
        some: { id: { gt: 1 } }, // Ensures there are multiple users
      },
    },
    orderBy: { id: "asc" },
    include: {
      users: true, // Ensure that projectMembers are included
    },
  })

  // Filter teams if the privilege is CONTRIBUTOR
  // Now explicitly type the teams to avoid the error
  const filteredTeams =
    privilege === MemberPrivileges.CONTRIBUTOR
      ? projectMembers.filter((projectMember: ProjectMemberWithUsers) =>
          projectMember.users.some((user) => user.id === currentUser?.id)
        )
      : projectMembers

  let teamInformation: TeamInformation[] = filteredTeams.map((team) => {
    let t: TeamInformation = {
      name: team.name ?? "Unknown",
      id: team.id,
      projectId: projectId,
    }
    return t
  })

  const tableColumns =
    privilege === MemberPrivileges.CONTRIBUTOR ? projectMemberTeamTableColumns : pmTeamTableColumns

  return (
    <div>
      <Table columns={tableColumns} data={teamInformation} addPagination={true} />
    </div>
  )
}

// Issue 37
const TeamsPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()

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
