import { TeamTaskListDoneColumns } from "../tables/columns/TeamTaskListDoneColumns"
import { MemberPrivileges } from "db"
import ProjectMemberTaskListDone from "src/projectmembers/components/ProjectMemberTaskListDone"
import { processTeamTaskListDone } from "../tables/processing/processTeamTaskListDone"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { TaskLogWithTaskCompleted } from "src/core/types"

interface TeamTaskListDoneProps {
  teamId: number
  projectId: number
  privilege: MemberPrivileges
}

export const TeamTaskListDone = ({ teamId, projectId, privilege }: TeamTaskListDoneProps) => {
  const currentUser = useCurrentUser()
  const locale = currentUser?.language || "en-US"

  const localDataProcessor = (taskLogs: TaskLogWithTaskCompleted[]) =>
    processTeamTaskListDone(taskLogs, locale)

  return (
    <ProjectMemberTaskListDone
      projectMemberId={teamId}
      projectId={projectId}
      privilege={privilege}
      tableColumns={TeamTaskListDoneColumns}
      dataProcessor={localDataProcessor}
      title="Team Tasks"
      tooltipContent="Only completed tasks are included"
    />
  )
}
