import { MemberPrivileges } from "db"
import { processRoleSimpleTableData } from "../tables/processing/processRoleSimpleTableData"
import { RoleSimpleTableColumns } from "../tables/columns/RoleSimpleTableColumns"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import Card from "src/core/components/Card"
import ProjectMemberRolesList from "src/projectmembers/components/ProjectMemberRolesList"

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
      tableColumns={RoleSimpleTableColumns}
      dataProcessor={processRoleSimpleTableData}
    />
  </Card>
)
