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
import { ProjectMemberRolesList } from "src/roles/components/ProjectMembersRolesList"
import { TeamTaskListDone } from "src/teams/components/TeamTaskListDone"
import { roleTableColumnsTeam } from "src/roles/components/RoleTable"
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

  const { projectMember: currentProjectMember } = useCurrentProjectMember(projectId)

  const membersId = projectMembers.map((projectMember) => projectMember.userId)

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
              {projectMembers.map((projectMember) => {
                return (
                  <p key={projectMember.id}>
                    {projectMember["user"].firstName || projectMember["user"].lastName
                      ? `${projectMember["user"].firstName} ${projectMember["user"].lastName}`
                      : projectMember["user"].username}
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
              <ProjectMemberRolesList
                usersId={membersId}
                projectId={projectId}
                columns={roleTableColumnsTeam}
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
