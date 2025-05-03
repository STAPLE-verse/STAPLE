import { MemberPrivileges } from "db"
import ProjectMemberTaskList from "src/projectmembers/components/ProjectMemberTaskList"
import Card from "src/core/components/Card"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { ContributorTaskListColumns } from "../tables/columns/ContributorTaskListColumns"
import { processContributorTaskList } from "../tables/processing/processContributorTaskList"

interface ContributorTaskListProps {
  contributorId: number
  projectId: number
  privilege: MemberPrivileges
}

export const ContributorTaskList = ({
  contributorId,
  projectId,
  privilege,
}: ContributorTaskListProps) => (
  <Card
    title="Contributor Tasks"
    className="w-full"
    tooltipContent="Only completed tasks are included"
    actions={
      privilege === MemberPrivileges.PROJECT_MANAGER && (
        <Link className="btn btn-primary" href={Routes.RolesPage({ projectId })}>
          Edit Roles
        </Link>
      )
    }
  >
    <ProjectMemberTaskList
      projectMemberId={contributorId}
      tableColumns={ContributorTaskListColumns}
      dataProcessor={processContributorTaskList}
    />
  </Card>
)
