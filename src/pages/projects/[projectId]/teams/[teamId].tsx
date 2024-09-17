import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getTeam from "src/teams/queries/getTeam"
import deleteTeam from "src/teams/mutations/deleteTeam"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import { ProjectMemberLabelsList } from "src/labels/components/ProjectMembersLabelsList"
import { TeamTaskListDone } from "src/teams/components/TeamTaskListDone"
import { labelTableColumnsTeam } from "src/labels/components/LabelTable"
import { MemberPrivileges } from "db"
import { useCurrentProjectMember } from "src/projectmembers/hooks/useCurrentProjectMember"

export const ShowTeamPage = () => {
  const router = useRouter()
  const [deleteTeamMutation] = useMutation(deleteTeam)

  const projectId = useParam("projectId", "number")

  const teamId = useParam("teamId", "number")
  const [team] = useQuery(getTeam, { id: teamId })

  const [{ projectMembers }] = useQuery(getProjectMembers, {
    where: { teams: { some: { id: teamId } } },
    orderBy: { id: "asc" },
    include: {
      user: true,
    },
  })

  const { contributor: currentProjectMember } = useCurrentProjectMember(projectId)

  const membersId = projectMembers.map((contributor) => contributor.userId)

  const handleDelete = async () => {
    if (window.confirm("The team will be permanently deleted. Are you sure to continue?")) {
      await deleteTeamMutation({ id: team.id })
      await router.push(Routes.TeamsPage({ projectId: projectId! }))
    }
  }

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Team {team.name}</title>
        </Head>

        <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
          <div className="card bg-base-300 w-full">
            <div className="card-body">
              <div className="card-title">Team: {team.name} </div>
              {projectMembers.map((contributor) => {
                return (
                  <p key={contributor.id}>
                    {contributor["user"].firstName || contributor["user"].lastName
                      ? `${contributor["user"].firstName} ${contributor["user"].lastName}`
                      : contributor["user"].username}
                  </p>
                )
              })}
            </div>
            <div className="card-actions justify-end m-2">
              {currentProjectMember!.privilege === MemberPrivileges.PROJECT_MANAGER && (
                <Link
                  className="btn btn-primary"
                  href={Routes.EditTeamPage({ projectId: projectId!, teamId: team.id })}
                >
                  Edit Team
                </Link>
              )}
            </div>
          </div>

          <div className="card bg-base-300 w-full mt-2">
            <div className="card-body">
              <div className="card-title">Team Member Contribution Roles</div>
              <ProjectMemberLabelsList
                usersId={membersId}
                projectId={projectId}
                columns={labelTableColumnsTeam}
              />
            </div>
          </div>

          <div className="card bg-base-300 w-full mt-2">
            <div className="card-body">
              <div className="card-title">Team Task Contribution Roles</div>
              <TeamTaskListDone teamId={teamId} />
            </div>
          </div>
          {currentProjectMember!.privilege === MemberPrivileges.PROJECT_MANAGER && (
            <div className="flex justify-end mt-4">
              <button type="button" className="btn btn-secondary" onClick={handleDelete}>
                Delete Team
              </button>
            </div>
          )}
        </main>
      </Suspense>
    </Layout>
  )
}

ShowTeamPage.authenticate = true

export default ShowTeamPage
