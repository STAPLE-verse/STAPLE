import { Suspense } from "react"
import Head from "next/head"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { TeamTaskListDone } from "src/teams/components/TeamTaskListDone"
import { MemberPrivileges } from "db"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { TeamRolesList } from "src/teams/components/TeamRolesList"
import DeleteTeam from "src/teams/components/DeleteTeam"
import TeamInformation from "src/teams/components/TeamInformation"
import getTeam from "src/teams/queries/getTeam"

export const ShowTeamPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()
  const teamId = useParam("teamId", "number")

  const [team] = useQuery(getTeam, {
    teamId: teamId!,
    projectId: projectId!,
  })

  const userIds = team.users.map((user) => user.id)

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Team {team.name}</title>
        </Head>

        <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
          <TeamInformation team={team} privilege={privilege!} />

          <TeamRolesList usersId={userIds} projectId={projectId} />

          <TeamTaskListDone teamId={teamId!} />

          {privilege === MemberPrivileges.PROJECT_MANAGER && (
            <div className="flex justify-end mt-4">
              <DeleteTeam team={team} />
            </div>
          )}
        </main>
      </Suspense>
    </Layout>
  )
}

ShowTeamPage.authenticate = true

export default ShowTeamPage
