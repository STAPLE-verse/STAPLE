import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import deleteProjectMember from "src/projectmembers/mutations/deleteProjectMember"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { ProjectMember, User } from "@prisma/client"
import { getPrivilegeText } from "src/services/getPrivilegeText"

import { ProjectMemberTaskListDone } from "src/tasks/components/ProjectMembersTaskListDone"
import { ProjectMemberRolesList } from "src/roles/components/ProjectMembersRolesList"
import { roleTableColumnsSimple } from "src/roles/components/RoleTable"
import { finishedTasksTableColumns } from "src/tasks/components/TaskTable"
import Link from "next/link"
import { MemberPrivileges } from "db"
import toast from "react-hot-toast"

export const ProjectMemberPage = () => {
  const router = useRouter()
  const [deleteProjectMemberMutation] = useMutation(deleteProjectMember)

  const projectMemberId = useParam("projectMemberId", "number")
  const projectId = useParam("projectId", "number")

  const currentUser = useCurrentUser()
  const projectMember = useQuery(getProjectMember, {
    where: { id: projectMemberId },
    include: { user: true },
  }) as unknown as ProjectMember & {
    user: User
  }

  const [currentProjectMember] = useQuery(getProjectMember, {
    where: { projectId: projectId, id: projectMemberId },
    include: { teams: true },
  })

  const user = projectMember[0].user
  const teams = currentProjectMember.hasOwnProperty("teams")
    ? currentProjectMember["teams"].map((team) => team.name)
    : ""

  const handleDelete = async () => {
    if (
      window.confirm(
        "This projectMember will be removed from the project. Are you sure to continue?"
      )
    ) {
      try {
        await deleteProjectMemberMutation({ id: projectMember[0].id })
        // Check if User removed themselves and return to main page
        if (user.id === currentUser?.id) {
          await router.push(Routes.ProjectsPage())
        } else {
          await router.push(Routes.ProjectMembersPage({ projectId: projectId! }))
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <>
      <Head>
        <title>{user.username} Contributions</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <div className="card bg-base-300 w-full">
          <div className="card-body">
            <div className="card-title">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username}
            </div>
            {user.firstName && user.lastName ? (
              <p>
                <span className="font-semibold">Username:</span> {user.username}
              </p>
            ) : null}
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Privilege:</span>{" "}
              {getPrivilegeText(projectMember[0].privilege)}
            </p>

            <p>
              <span className="font-semibold">Team Membership:</span> {teams.join(", ")}
            </p>

            <div className="card-actions justify-end">
              {currentProjectMember.privilege === MemberPrivileges.PROJECT_MANAGER ? (
                <Link
                  className="btn btn-primary"
                  href={Routes.EditProjectMemberPage({
                    projectId: projectId!,
                    projectMemberId: projectMemberId!,
                  })}
                >
                  Edit Contributor
                </Link>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-300 w-full mt-2">
          <div className="card-body">
            <div className="card-title">Contribution Roles</div>
            <ProjectMemberRolesList
              usersId={[user?.id]}
              projectId={projectId}
              columns={roleTableColumnsSimple}
            />
            <div className="card-actions justify-end">
              {currentProjectMember.privilege === MemberPrivileges.PROJECT_MANAGER && (
                <Link
                  className="btn btn-primary"
                  href={Routes.CreditPage({ projectId: projectId! })}
                >
                  Edit Roles
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-300 w-full mt-2">
          <div className="card-body">
            <div className="card-title">Contribution Tasks</div>
            <ProjectMemberTaskListDone
              projectMember={currentProjectMember}
              columns={finishedTasksTableColumns}
            />

            <div className="card-actions justify-end">
              {currentProjectMember.privilege === MemberPrivileges.PROJECT_MANAGER && (
                <Link
                  className="btn btn-primary"
                  href={Routes.CreditPage({ projectId: projectId! })}
                >
                  Edit Roles
                </Link>
              )}
            </div>
          </div>
        </div>
        {currentProjectMember.privilege === MemberPrivileges.PROJECT_MANAGER && (
          <div className="flex justify-end mt-4">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleDelete}
              style={{ marginLeft: "0.5rem" }}
            >
              Delete Contributor
            </button>
          </div>
        )}
      </main>
    </>
  )
}

const ShowProjectMemberPage = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectMemberPage />
      </Suspense>
    </Layout>
  )
}

ShowProjectMemberPage.authenticate = true

export default ShowProjectMemberPage
