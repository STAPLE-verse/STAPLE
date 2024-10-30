import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { getPrivilegeText } from "src/services/getPrivilegeText"
import Link from "next/link"
import { MemberPrivileges } from "db"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import getTeamNames from "src/teams/queries/getTeamNames"
import getProjectPrivilege from "src/projectprivileges/queries/getProjectPrivilege"
import { Tooltip } from "react-tooltip"
import getContributor from "src/contributors/queries/getContributor"
import { getContributorName } from "src/services/getName"
import { ContributorTaskListDone } from "src/contributors/components/ContributorTaskListDone"
import { ContributorRolesList } from "src/roles/components/ContributorRolesList"
import DeleteContributor from "src/contributors/components/DeleteContributor"

export const ContributorPage = () => {
  const { privilege } = useMemberPrivileges()
  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")

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

            {privilege === MemberPrivileges.PROJECT_MANAGER && (
              <div className="card-actions justify-end">
                <Link
                  href={Routes.EditContributorPage({
                    projectId: projectId!,
                    contributorId: contributorId!,
                  })}
                  className="btn btn-primary"
                >
                  Edit Contributor
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-300 w-full mt-2">
          <div className="card-body">
            <div className="card-title">Contributor Roles</div>
            <ContributorRolesList usersId={[contributorUser!.id]} projectId={projectId} />
            <div className="card-actions justify-end">
              {privilege === MemberPrivileges.PROJECT_MANAGER && (
                <Link
                  className="btn btn-primary"
                  href={Routes.RolesPage({ projectId: projectId! })}
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
              Contributor Tasks
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
                  href={Routes.RolesPage({ projectId: projectId! })}
                >
                  Edit Roles
                </Link>
              )}
            </div>
          </div>
        </div>
        {privilege === MemberPrivileges.PROJECT_MANAGER && (
          <div className="flex justify-end">
            <DeleteContributor contributor={contributor!} />
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
