import { TeamTaskListDoneColumns } from "../tables/columns/TeamTaskListDoneColumns"
import ProjectMemberTaskListDone from "src/projectmembers/components/ProjectMemberTaskListDone"
import { processTeamTaskListDone } from "../tables/processing/processTeamTaskListDone"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { TaskLogWithTaskCompleted } from "src/core/types"
import Card from "src/core/components/Card"

interface TeamTaskListDoneProps {
  teamId: number
}

export const TeamTaskListDone = ({ teamId }: TeamTaskListDoneProps) => {
  const currentUser = useCurrentUser()
  const locale = currentUser?.language || "en-US"

  const localDataProcessor = (taskLogs: TaskLogWithTaskCompleted[]) =>
    processTeamTaskListDone(taskLogs, locale)

  return (
    <Card title="Team Tasks" tooltipContent="Only completed tasks are included" className="w-full">
      <ProjectMemberTaskListDone
        projectMemberId={teamId}
        tableColumns={TeamTaskListDoneColumns}
        dataProcessor={localDataProcessor}
      />
    </Card>
  )
}
