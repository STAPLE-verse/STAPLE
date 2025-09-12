import { Suspense } from "react"
import { useQuery } from "@blitzjs/rpc"
import { Routes, useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { MemberPrivileges } from "db"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import DeleteTeam from "src/teams/components/DeleteTeam"
import TeamInformation from "src/teams/components/TeamInformation"
import getTeam from "src/teams/queries/getTeam"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import Link from "next/link"
import { TeamStatistics } from "src/teams/components/TeamStatistics"
import ProjectMemberTaskList from "src/projectmembers/components/ProjectMemberTaskList"
import { TaskLogProjectMemberColumns } from "src/tasklogs/tables/columns/TaskLogProjectMemberColumns"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"

export const TeamPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()
  const teamId = useParam("teamId", "number")
  const { projectMember: currentContributor } = useCurrentContributor(projectId)

  const [team] = useQuery(getTeam, {
    id: teamId!,
  })

  return (
    <>
      <main className="flex flex-col mx-auto w-full">
        <h1 className="flex justify-center items-center text-3xl">
          {team.name}
          <InformationCircleIcon
            className="ml-2 h-5 w-5 stroke-2 text-info"
            data-tooltip-id="team-tooltip"
          />
          <Tooltip
            id="team-tooltip"
            content="Use this page to review a team’s tasks, track their completion status, and manage members within the team."
            className="z-[1099] ourtooltips"
          />
        </h1>

        {privilege === MemberPrivileges.PROJECT_MANAGER && (
          <div className="flex justify-center mt-4 gap-2">
            <Link
              href={Routes.EditTeamPage({
                projectId: team.projectId,
                teamId: team.id,
              })}
              className="btn btn-primary"
            >
              Edit Team
            </Link>

            <DeleteTeam team={team} />
          </div>
        )}

        <TeamStatistics teamId={teamId} projectId={projectId} />

        <TeamInformation team={team} privilege={privilege!} />

        <ProjectMemberTaskList
          projectMemberId={teamId!}
          tableColumns={TaskLogProjectMemberColumns}
          currentContributor={currentContributor!.id}
        />
      </main>
    </>
  )
}

const ShowTeamPage = () => {
  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Team Page">
      <Suspense fallback={<div>Loading...</div>}>
        <TeamPage />
      </Suspense>
    </Layout>
  )
}

ShowTeamPage.authenticate = true

export default ShowTeamPage
