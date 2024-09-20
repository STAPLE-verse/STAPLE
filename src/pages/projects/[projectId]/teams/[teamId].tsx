import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import deleteTeam from "src/teams/mutations/deleteTeam"
import { ProjectMemberRolesList } from "src/roles/components/ProjectMemberRolesList"
import { TeamTaskListDone } from "src/teams/components/TeamTaskListDone"
import { roleTableColumnsTeam } from "src/roles/components/RoleTable"
import { MemberPrivileges, Prisma } from "db"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import { ProjectMemberWithUsers } from "."
import { useMemberPrivileges } from "src/projectmembers/components/MemberPrivilegesContext"

export const ShowTeamPage = () => {
  const router = useRouter()
  const [deleteTeamMutation] = useMutation(deleteTeam)

  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()

  const teamId = useParam("teamId", "number")

  const [teamProjectMember] = useQuery(getProjectMember, {
    where: { id: teamId },
    include: {
      users: true,
    },
  }) as [ProjectMemberWithUsers, any]

  const users = teamProjectMember.users
  const userIds = users.map((user) => user.id)

  const handleDelete = async () => {
    if (window.confirm("The team will be permanently deleted. Are you sure to continue?")) {
      await deleteTeamMutation({ id: teamProjectMember.id })
      await router.push(Routes.TeamsPage({ projectId: projectId! }))
    }
  }

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Team {teamProjectMember.name}</title>
        </Head>

        <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
          <div className="card bg-base-300 w-full">
            <div className="card-body">
              <div className="card-title">Team: {teamProjectMember.name} </div>
              {users.map((user) => {
                return (
                  <p key={user.id}>
                    {user.firstName || user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username}
                  </p>
                )
              })}
            </div>
            <div className="card-actions justify-end m-2">
              {privilege === MemberPrivileges.PROJECT_MANAGER && (
                <Link
                  className="btn btn-primary"
                  href={Routes.EditTeamPage({
                    projectId: projectId!,
                    teamId: teamProjectMember.id,
                  })}
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
                usersId={userIds}
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
          {privilege === MemberPrivileges.PROJECT_MANAGER && (
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
