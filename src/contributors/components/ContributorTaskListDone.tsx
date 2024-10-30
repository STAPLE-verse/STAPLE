import { MemberPrivileges } from "db"
import { FinishedTasksColumns } from "src/tasks/tables/columns/FinishedTasksColumns"
import { processFinishedTasks } from "src/tasks/tables/processing/processFinishedTasks"
import ProjectMemberTaskListDone from "src/projectmembers/components/ProjectMemberTaskListDone"

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
  <ProjectMemberTaskListDone
    projectMemberId={contributorId}
    projectId={projectId}
    privilege={privilege}
    tableColumns={FinishedTasksColumns}
    dataProcessor={processFinishedTasks}
    title="Contributor Tasks"
    tooltipContent="Only completed tasks are included"
  />
)
