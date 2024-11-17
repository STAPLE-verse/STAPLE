import CompleteSchema from "./CompleteSchema"
import CompleteToggle from "./CompleteToggle"
import { CompletedAs } from "db"
import { ProjectMemberWithTaskLog, useTaskContext } from "src/tasks/components/TaskContext"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import TaskLogHistoryModal from "./TaskLogHistoryModal"
import { useSeparateProjectMembers } from "src/projectmembers/hooks/useSeparateProjectMembers"
import { filterLatestTaskLog } from "../utils/filterLatestTaskLog"
import Card from "src/core/components/Card"
import { CompleteRow } from "./CompleteRow"

export const TaskLogCompletion = () => {
  const { task, projectMembers } = useTaskContext()
  const { projectMember: currentContributor } = useCurrentContributor(task.projectId)
  const currentUser = useCurrentUser()

  // Filter based on the currentUser
  const filteredProjectMembers = projectMembers.filter(
    (projectMember) =>
      !projectMember.deleted && // Exclude deleted members
      projectMember.users.some((user) => user.id === currentUser?.id) // Include ProjectMembers that have the current user
  )

  return (
    <Card
      title="Complete Task"
      tooltipContent="Complete your individual or team task and view completion history"
      className="w-2/3"
    >
      {filteredProjectMembers.map((projectMember) => (
        <CompleteRow
          key={projectMember.id}
          taskLogs={projectMember.taskLogAssignedTo}
          completedById={currentContributor?.id}
          completedAs={projectMember.name === null ? CompletedAs.INDIVIDUAL : CompletedAs.TEAM}
          schema={task.formVersion?.schema}
          ui={task.formVersion?.uiSchema}
          isSchema={!!task.formVersion}
        />
      ))}
    </Card>
  )
}
