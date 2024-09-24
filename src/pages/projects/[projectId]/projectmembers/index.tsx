import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import {
  ProjectMemberInformation,
  pmProjectMemberTableColumns,
  projectMemberProjectMemberTableColumns,
} from "src/projectmembers/components/ProjectMemberTable"
import Table from "src/core/components/Table"
import { useMemberPrivileges } from "src/projectmembers/components/MemberPrivilegesContext"
import { MemberPrivileges, ProjectMember, User } from "@prisma/client"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

interface AllProjectMembersListProps {
  privilege: MemberPrivileges
}
type ProjectMemberWithUsers = ProjectMember & {
  users: User[]
}

export const AllProjectMembersList = ({ privilege }: AllProjectMembersListProps) => {
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

  // this makes sure team name is empty
  const [{ projectMembers }] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      users: {
        every: {
          id: { not: undefined }, // Ensures there's at least one user
        },
        none: {
          id: { gt: 1 }, // Ensures there is only one user
        },
      },
      name: { equals: null }, // Ensures the name in ProjectMember is null
    },
    orderBy: { id: "asc" },
    include: {
      users: true,
    },
  })

  const filteredProjectMembers =
    privilege === MemberPrivileges.CONTRIBUTOR
      ? projectMembers.filter(
          (member: ProjectMemberWithUsers) =>
            member.users.length === 1 && member.users[0]?.id === currentUser?.id
        )
      : projectMembers

  let projectMemberInformation: ProjectMemberInformation[] = filteredProjectMembers.map(
    (projectMember) => {
      // Assuming users array is not empty and has at least one user
      const user = projectMember["users"][0] // Get the first user
      const firstName = user?.firstName || ""
      const lastName = user?.lastName || ""
      const username = user?.username || ""

      let t: ProjectMemberInformation = {
        name: firstName || lastName ? `${firstName} ${lastName}` : username,
        id: projectMember.id,
        projectId: projectId,
      }

      return t
    }
  )

  const tableColumns =
    privilege === MemberPrivileges.CONTRIBUTOR
      ? projectMemberProjectMemberTableColumns
      : pmProjectMemberTableColumns

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <Table columns={tableColumns} data={projectMemberInformation} addPagination={true} />
    </main>
  )
}
// issue 37
const ProjectMembersPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()

  return (
    <Layout>
      <Head>
        <title>All Contributors</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Contributors</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <AllProjectMembersList privilege={privilege!} />
        </Suspense>
        {privilege === MemberPrivileges.PROJECT_MANAGER && (
          <div>
            <Link
              className="btn btn-primary mb-4 mt-4"
              href={Routes.NewProjectMemberPage({ projectId: projectId! })}
            >
              Invite Contributor
            </Link>

            <Link
              className="btn btn-secondary mx-2 mb-4 mt-4"
              href={Routes.InvitesPagePM({ projectId: projectId! })}
            >
              View Invitations
            </Link>
          </div>
        )}
      </main>
    </Layout>
  )
}

export default ProjectMembersPage
