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
import { getPrivilegeText } from "src/services/getPrivilegeText"

import { ProjectMembersTaskListDone } from "src/tasks/components/ProjectMembersTaskListDone"
import { ProjectMemberRolesList } from "src/roles/components/ProjectMemberRolesList"
import { roleTableColumnsSimple } from "src/roles/components/RoleTable"
import { finishedTasksTableColumns } from "src/tasks/components/TaskTable"
import Link from "next/link"
import { MemberPrivileges, ProjectMember, User } from "db"
import toast from "react-hot-toast"
import { useMemberPrivileges } from "src/projectmembers/components/MemberPrivilegesContext"
import getTeamNames from "src/teams/queries/getTeamNames"
import getProjectPrivilege from "src/projectmembers/queries/getProjectPrivilege"
import { Tooltip } from "react-tooltip"

type ProjectMemberWithUsers = ProjectMember & { users: User[] }

export const ProjectMemberPage = () => {
  const router = useRouter()
  const [deleteProjectMemberMutation] = useMutation(deleteProjectMember)
  const { privilege } = useMemberPrivileges()
  const projectMemberId = useParam("memberId", "number")
  const projectId = useParam("projectId", "number")

  const currentUser = useCurrentUser()
  const [projectMember] = useQuery(getProjectMember, {
    where: { id: projectMemberId },
    include: { users: true },
  })

  const typedprojectMember = projectMember as unknown as ProjectMemberWithUsers

  const projectMemberUser = typedprojectMember.users[0]

  const [projectMemberPrivilege] = useQuery(getProjectPrivilege, {
    where: { userId: projectMemberUser!.id, projectId: projectId },
  })

  // Get team memberships for the user
  const [teamNames] = useQuery(getTeamNames, {
    userId: projectMemberUser!.id,
    projectId: projectId,
  })

  const handleDelete = async () => {
    if (
      window.confirm("This Contributor will be removed from the project. Are you sure to continue?")
    ) {
      try {
        await deleteProjectMemberMutation({ id: projectMember.id })
        // Check if User removed themselves and return to main page
        if (projectMemberUser!.id === currentUser?.id) {
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
        <title>{projectMemberUser!.username} Contributions</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <div className="card bg-base-300 w-full">
          <div className="card-body">
            <div className="card-title">
              {projectMemberUser!.firstName && projectMemberUser!.lastName
                ? `${projectMemberUser!.firstName} ${projectMemberUser!.lastName}`
                : projectMemberUser!.username}
            </div>
            {projectMemberUser!.firstName && projectMemberUser!.lastName ? (
              <p>
                <span className="font-semibold">Username:</span> {projectMemberUser!.username}
              </p>
            ) : null}
            <p>
              <span className="font-semibold">Email:</span> {projectMemberUser!.email}
            </p>
            <p>
              <span className="font-semibold">Privilege:</span>{" "}
              {getPrivilegeText(projectMemberPrivilege.privilege)}
            </p>

            <p>
              <span className="font-semibold">Team Membership:</span>{" "}
              {teamNames.length > 0 ? teamNames.join(", ") : "No team memberships"}
            </p>

            <div className="card-actions justify-end">
              {privilege === MemberPrivileges.PROJECT_MANAGER ? (
                <Link
                  href={Routes.EditProjectMemberPage({
                    projectId: projectId!,
                    memberId: projectMemberId!,
                  })}
                  className="btn btn-primary"
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
              usersId={[projectMemberUser!.id]}
              projectId={projectId}
              columns={roleTableColumnsSimple}
            />
            <div className="card-actions justify-end">
              {privilege === MemberPrivileges.PROJECT_MANAGER && (
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
            <div className="card-title" data-tooltip-id="memberTasks">
              Contribution Tasks
            </div>
            <Tooltip
              id="memberTasks"
              content="Only completed tasks are included"
              className="z-[1099] ourtooltips"
            />
            <ProjectMembersTaskListDone
              projectMember={projectMember}
              columns={finishedTasksTableColumns}
            />

            <div className="card-actions justify-end">
              {privilege === MemberPrivileges.PROJECT_MANAGER && (
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
        {privilege === MemberPrivileges.PROJECT_MANAGER && (
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
