import { MemberPrivileges } from "db"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import Card from "src/core/components/Card"
import ProjectMemberRolesList from "src/projectmembers/components/ProjectMemberRolesList"
import { ContributorRolesListColumns } from "../tables/columns/ContributorRolesListColumns"
import { processContributorRolesList } from "../tables/processing/processContributorRolesList"

interface ContributorRolesListProps {
  usersId: number[]
  projectId: number
  privilege: MemberPrivileges
}

export const ContributorRolesList = ({
  usersId,
  projectId,
  privilege,
}: ContributorRolesListProps) => (
  <Card
    title={"Contributor Roles"}
    className="w-full"
    actions={
      privilege === MemberPrivileges.PROJECT_MANAGER && (
        <Link className="btn btn-primary" href={Routes.RolesPage({ projectId: projectId! })}>
          Edit Roles
        </Link>
      )
    }
  >
    <ProjectMemberRolesList
      usersId={usersId}
      projectId={projectId}
      tableColumns={ContributorRolesListColumns}
      dataProcessor={processContributorRolesList}
    />
  </Card>
)
