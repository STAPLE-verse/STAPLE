import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import {
  ProjectManagerContributorColumns,
  StandardContributorColumns,
} from "src/contributors/tables/columns/ContributorColumns"
import Table from "src/core/components/Table"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { MemberPrivileges } from "@prisma/client"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useContributorsData } from "src/contributors/hooks/useContributorsData"
import Loading from "src/core/components/Loading"
import { CurrentUser } from "src/users/queries/getCurrentUser"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import Card from "src/core/components/Card"

interface ContributorListProps {
  privilege: MemberPrivileges
  currentUser: CurrentUser
  projectId: number
}

export const ContributorList = ({ privilege, currentUser, projectId }: ContributorListProps) => {
  const contributorTableData = useContributorsData(privilege, currentUser, projectId)

  const tableColumns =
    privilege === MemberPrivileges.CONTRIBUTOR
      ? StandardContributorColumns
      : ProjectManagerContributorColumns

  return (
    <Suspense fallback={<Loading />}>
      <Card title="">
        <Table columns={tableColumns} data={contributorTableData} addPagination={true} />
      </Card>
    </Suspense>
  )
}

const ContributorsPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()
  const currentUser = useCurrentUser()

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="All Contributors">
      <main className="flex flex-col mx-auto w-full">
        <h1 className="flex justify-center items-center text-3xl">
          Contributors
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="contributors-overview"
          />
          <Tooltip
            id="contributors-overview"
            content="On this page, you can view the contributors (or yourself) on the project. Use see contributions to review an overview of the contributor and edit to update their project role."
            className="z-[1099] ourtooltips"
          />
        </h1>
        {privilege === MemberPrivileges.PROJECT_MANAGER && (
          <div className="flex justify-center">
            <Link
              className="btn btn-primary mb-2 mt-4"
              href={Routes.NewContributorPage({ projectId: projectId! })}
            >
              Invite Contributor(s)
            </Link>
            <Link
              className="btn btn-secondary mx-2 mb-2 mt-4"
              href={Routes.InvitesPagePM({ projectId: projectId! })}
            >
              View Invitations
            </Link>
            <Link
              href={Routes.RoleBuilderPage()}
              className="btn btn-info mb-2 mt-4"
              data-tooltip-id="roles-overview"
            >
              Go to Roles
            </Link>
            <Tooltip
              id="roles-overview"
              content="Set up project roles on the Roles page so you can assign them to contributors. You can add or edit roles later."
              className="z-[1099] ourtooltips"
            />
          </div>
        )}
        <Suspense fallback={<Loading />}>
          <ContributorList
            privilege={privilege!}
            currentUser={currentUser!}
            projectId={projectId!}
          />
        </Suspense>
      </main>
    </Layout>
  )
}

export default ContributorsPage
