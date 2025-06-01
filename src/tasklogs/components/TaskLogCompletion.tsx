import { CompletedAs } from "db"
import { useTaskContext } from "src/tasks/components/TaskContext"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import { CompleteRow } from "./CompleteRow"
import CollapseCard from "src/core/components/CollapseCard"

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
    <CollapseCard
      title="Your Task(s)"
      tooltipContent="Complete your individual or team task and view completion history"
      className="w-full"
    >
      {filteredProjectMembers.map((projectMember) => (
        <div key={projectMember.id}>
          <CompleteRow
            taskLogs={projectMember.taskLogAssignedTo}
            completedById={currentContributor?.id}
            completedAs={projectMember.name === null ? CompletedAs.INDIVIDUAL : CompletedAs.TEAM}
            schema={task.formVersion?.schema}
            ui={task.formVersion?.uiSchema}
            isSchema={!!task.formVersion}
          />
        </div>
      ))}
    </CollapseCard>
  )
}
