import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import deleteProjectMember from "src/projectmembers/mutations/deleteProjectMember"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { getPrivilegeText } from "src/services/getPrivilegeText"

import { ProjectMemberRolesList } from "src/roles/components/ProjectMemberRolesList"
import { roleTableColumnsSimple } from "src/roles/components/RoleTable"
import Link from "next/link"
import { MemberPrivileges } from "db"
import toast from "react-hot-toast"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import getTeamNames from "src/teams/queries/getTeamNames"
import getProjectPrivilege from "src/projectprivileges/queries/getProjectPrivilege"
import { Tooltip } from "react-tooltip"
import getContributor from "src/contributors/queries/getContributor"
import { getContributorName } from "src/services/getName"
import { ContributorTaskListDone } from "src/contributors/components/ContributorTaskListDone"

export const ContributorPage = () => {
  const router = useRouter()
  const [deleteProjectMemberMutation] = useMutation(deleteProjectMember)
  const { privilege } = useMemberPrivileges()
  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")

  const currentUser = useCurrentUser()

  const [contributor] = useQuery(getContributor, { contributorId: contributorId! })

  const contributorUser = contributor?.users[0]

  const [contributorPrivilege] = useQuery(getProjectPrivilege, {
    where: { userId: contributorUser!.id, projectId: projectId },
  })

  // Get team memberships for the user
  const [teamNames] = useQuery(getTeamNames, {
    userId: contributorUser!.id,
    projectId: projectId,
  })

  // Event handler for deleting a contributor
  const handleDelete = async () => {
    if (
      window.confirm("This Contributor will be removed from the project. Are you sure to continue?")
    ) {
      try {
        await deleteProjectMemberMutation({ id: contributorUser!.id })
        // Check if User removed themselves and return to main page
        if (contributorUser!.id === currentUser?.id) {
          await router.push(Routes.ProjectsPage())
        } else {
          await router.push(Routes.ContributorsPage({ projectId: projectId! }))
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <>
      <Head>
        <title>{contributorUser!.username} Contributions</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <div className="card bg-base-300 w-full">
          <div className="card-body">
            <div className="card-title">{getContributorName(contributor)}</div>
            {contributorUser!.firstName && contributorUser!.lastName ? (
              <p>
                <span className="font-semibold">Username:</span> {contributorUser!.username}
              </p>
            ) : null}
            <p>
              <span className="font-semibold">Email:</span> {contributorUser!.email}
            </p>
            <p>
              <span className="font-semibold">Privilege:</span>{" "}
              {getPrivilegeText(contributorPrivilege.privilege)}
            </p>

            <p>
              <span className="font-semibold">Team Membership:</span>{" "}
              {teamNames.length > 0 ? teamNames.join(", ") : "No team memberships"}
            </p>

            <div className="card-actions justify-end">
              {privilege === MemberPrivileges.PROJECT_MANAGER ? (
                <Link
                  href={Routes.EditContributorPage({
                    projectId: projectId!,
                    contributorId: contributorId!,
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
              usersId={[contributorUser!.id]}
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
            <ContributorTaskListDone contributor={contributor} />

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

const ShowContributorPage = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <ContributorPage />
      </Suspense>
    </Layout>
  )
}

ShowContributorPage.authenticate = true

export default ShowContributorPage
