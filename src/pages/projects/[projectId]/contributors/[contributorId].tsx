import { Suspense } from "react"
import { Routes, useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import ContributorInformation from "src/contributors/components/ContributorInformation"
import { useContributorData } from "src/contributors/hooks/useContributorData"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import { MemberPrivileges } from "db"
import Link from "next/link"
import DeleteContributor from "src/contributors/components/DeleteContributor"
import ProjectMemberTaskList from "src/projectmembers/components/ProjectMemberTaskList"
import { TaskLogProjectMemberColumns } from "src/tasklogs/tables/columns/TaskLogProjectMemberColumns"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import ContributorTeams from "src/contributors/components/ContributorTeams"

export const ContributorPage = () => {
  const { privilege } = useMemberPrivileges()
  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")
  const { projectMember: currentContributor } = useCurrentContributor(projectId)

  const { contributorUser, contributorPrivilege, teamNames } = useContributorData(
    contributorId!,
    projectId!
  )

  return (
    <>
      <main className="flex flex-col mx-auto w-full">
        <h1 className="flex justify-center items-center text-3xl">
          {contributorUser!.firstName
            ? `${contributorUser!.firstName} ${contributorUser!.lastName}`
            : contributorUser!.username}
          <InformationCircleIcon
            className="ml-2 h-5 w-5 stroke-2 text-info"
            data-tooltip-id="team-tooltip"
          />
          <Tooltip
            id="team-tooltip"
            content="This page allows you to review the contributors information, overall sttatistics, and tasks they are assigned to as an individual."
            className="z-[1099] ourtooltips"
          />
        </h1>
        {privilege === MemberPrivileges.PROJECT_MANAGER && (
          <div className="flex justify-center mt-4 gap-2">
            <Link
              href={Routes.EditContributorPage({
                projectId: projectId!,
                contributorId: contributorUser!.id,
              })}
              className="btn btn-primary"
            >
              Edit Contributor
            </Link>
            <DeleteContributor
              projectId={projectId!}
              contributorUser={contributorUser!}
              contributorId={contributorId!}
            />
          </div>
        )}

        <ContributorInformation
          contributorPrivilege={contributorPrivilege}
          contributorUser={contributorUser!}
        />

        {teamNames.length > 0 && (
          <ContributorTeams teamNames={teamNames} privilege={contributorPrivilege} />
        )}

        <ProjectMemberTaskList
          projectMemberId={contributorId!}
          tableColumns={TaskLogProjectMemberColumns}
          currentContributor={currentContributor!.id}
        />
      </main>
    </>
  )
}

const ShowContributorPage = () => {
  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Contributions">
      <Suspense fallback={<div>Loading...</div>}>
        <ContributorPage />
      </Suspense>
    </Layout>
  )
}

ShowContributorPage.authenticate = true

export default ShowContributorPage
