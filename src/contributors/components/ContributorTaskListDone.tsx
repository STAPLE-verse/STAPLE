import { MemberPrivileges } from "db"
import ProjectMemberTaskListDone from "src/projectmembers/components/ProjectMemberTaskListDone"
import Card from "src/core/components/Card"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { ContributorTaskListDoneColumns } from "../tables/columns/ContributorTaskListDoneColumns"
import { processContributorTaskListDone } from "../tables/processing/processContributorTaskListDone"

interface ContributorTaskListDoneProps {
  contributorId: number
  projectId: number
  privilege: MemberPrivileges
}

export const ContributorTaskListDone = ({
  contributorId,
  projectId,
  privilege,
}: ContributorTaskListDoneProps) => (
  <Card
    title="Contributor Tasks"
    tooltipContent="Only completed tasks are included"
    actions={
      privilege === MemberPrivileges.PROJECT_MANAGER && (
        <Link className="btn btn-primary" href={Routes.RolesPage({ projectId })}>
          Edit Roles
        </Link>
      )
    }
  >
    <ProjectMemberTaskListDone
      projectMemberId={contributorId}
      tableColumns={ContributorTaskListDoneColumns}
      dataProcessor={processContributorTaskListDone}
    />
  </Card>
)
