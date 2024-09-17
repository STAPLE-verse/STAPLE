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
import { MemberPrivileges } from "@prisma/client"
import { useCurrentProjectMember } from "src/projectmembers/hooks/useCurrentProjectMember"

interface AllProjectMembersListProps {
  privilege: MemberPrivileges
}

export const AllProjectMembersList = ({ privilege }: AllProjectMembersListProps) => {
  const projectId = useParam("projectId", "number")
  const { projectMember: currentProjectMember } = useCurrentProjectMember(projectId)

  const [{ projectMembers }] = useQuery(getProjectMembers, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    include: {
      user: true,
    },
  })

  const filteredProjectMembers =
    privilege === MemberPrivileges.CONTRIBUTOR
      ? projectMembers.filter((projectMember) => projectMember.id === currentProjectMember?.id)
      : projectMembers

  let projectMemberInformation: ProjectMemberInformation[] = filteredProjectMembers.map(
    (projectMember) => {
      const firstName = projectMember["user"].firstName
      const lastName = projectMember["user"].lastName
      const username = projectMember["user"].username
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
