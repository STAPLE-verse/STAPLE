import { TeamTaskListColumns } from "../tables/columns/TeamTaskListColumns"
import ProjectMemberTaskList from "src/projectmembers/components/ProjectMemberTaskList"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { TaskLogWithTaskCompleted } from "src/core/types"
import { processTeamTaskList } from "../tables/processing/processTeamTaskList"

import CollapseCard from "src/core/components/CollapseCard"

interface TeamTaskListProps {
  teamId: number
}

export const TeamTaskList = ({ teamId }: TeamTaskListProps) => {
  const currentUser = useCurrentUser()
  const locale = currentUser?.language || "en-US"

  const localDataProcessor = (taskLogs: TaskLogWithTaskCompleted[]) =>
    processTeamTaskList(taskLogs, locale)

  return (
    <CollapseCard title="Team Tasks" className="w-full mt-4">
      <ProjectMemberTaskList
        projectMemberId={teamId}
        tableColumns={TeamTaskListColumns}
        dataProcessor={localDataProcessor}
      />
    </CollapseCard>
  )
}
