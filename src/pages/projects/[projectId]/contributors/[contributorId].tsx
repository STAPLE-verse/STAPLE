import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import Link from "next/link"
import { MemberPrivileges } from "db"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { Tooltip } from "react-tooltip"
import { ContributorTaskListDone } from "src/contributors/components/ContributorTaskListDone"
import { ContributorRolesList } from "src/roles/components/ContributorRolesList"
import DeleteContributor from "src/contributors/components/DeleteContributor"
import ContributorInformation from "src/contributors/components/ContributorInformation"
import { useContributorData } from "src/contributors/hooks/useContributorData"

export const ContributorPage = () => {
  const { privilege } = useMemberPrivileges()
  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")

  const { contributor, contributorUser, contributorPrivilege, teamNames } = useContributorData(
    contributorId!,
    projectId!
  )

  return (
    <>
      <Head>
        <title>{contributorUser!.username} Contributions</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <ContributorInformation
          projectId={projectId!}
          privilege={privilege!}
          contributorId={contributorId!}
          teamNames={teamNames}
          contributorPrivilege={contributorPrivilege}
          contributorUser={contributorUser!}
        />

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
