import { Tooltip } from "react-tooltip"
import CompleteSchema from "./CompleteSchema"
import CompleteToggle from "./CompleteToggle"
import { CompletedAs } from "db"
import { useTaskContext } from "src/tasks/components/TaskContext"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import TaskLogHistoryModal from "./TaskLogHistoryModal"
import { useSeparateProjectMembers } from "src/projectmembers/hooks/useSeparateProjectMembers"
import { filterLatestTaskLog } from "../utils/filterLatestTaskLog"

export const TaskLogCompletion = () => {
  const { task, projectMembers } = useTaskContext()
  const { individualProjectMembers, teamProjectMembers } = useSeparateProjectMembers(projectMembers)
  const { projectMember: currentProjectMember } = useCurrentContributor(task.projectId)
  const currentUser = useCurrentUser()

  // Filter based on the currentUser
  const individualProjectMember = individualProjectMembers.filter((projectMember) =>
    projectMember.users.some((user) => user.id === currentUser?.id)
  )[0]

  const filteredTeamProjectMembers = teamProjectMembers.filter((projectMember) =>
    projectMember.users.some((user) => user.id === currentUser?.id)
  )

  return (
    <div className="card bg-base-300 mx-2 w-2/3">
      <div className="card-body">
        <div className="card-title" data-tooltip-id="tool-complete">
          Complete Task
        </div>

        <Tooltip
          id="tool-complete"
          content="Complete your individual or team task and view completion history"
          className="z-[1099] ourtooltips"
        />

        {/* if no schema complete task as a Individual*/}
        {!task.formVersion && individualProjectMember && (
          <div className="flex grid-col-2">
            <CompleteToggle
              taskLog={filterLatestTaskLog(individualProjectMember.taskLogAssignedTo)}
              completedRole="Completed"
              completedById={currentProjectMember?.id}
              completedAs={CompletedAs.INDIVIDUAL}
            />
            <span className="mx-2">
              <TaskLogHistoryModal taskLogs={individualProjectMember.taskLogAssignedTo} />
            </span>
          </div>
        )}

        {/* if no schema complete task as a Team*/}
        {!task.formVersion &&
          filteredTeamProjectMembers &&
          filteredTeamProjectMembers.length > 0 && (
            <div>
              {filteredTeamProjectMembers.map((teamProjectMember) => (
                <div key={teamProjectMember.id} className="flex flex-row gap-2">
                  <CompleteToggle
                    taskLog={filterLatestTaskLog(teamProjectMember.taskLogAssignedTo)}
                    completedRole="Completed"
                    completedById={currentProjectMember?.id}
                    completedAs={CompletedAs.TEAM}
                  />
                  <span className="mx-2">
                    <TaskLogHistoryModal taskLogs={teamProjectMember.taskLogAssignedTo} />
                  </span>
                </div>
              ))}
            </div>
          )}

        {/* if schema and individual*/}
        {task.formVersion && individualProjectMember && (
          <div className="flex grid-col-2">
            <CompleteSchema
              taskLog={filterLatestTaskLog(individualProjectMember.taskLogAssignedTo)}
              completedById={currentProjectMember?.id}
              completedAs={CompletedAs.INDIVIDUAL}
              schema={task.formVersion.schema}
              ui={task.formVersion.uiSchema}
            />
            <span className="mx-2">
              <TaskLogHistoryModal
                taskLogs={individualProjectMember.taskLogAssignedTo}
                schema={task.formVersion.schema}
                ui={task.formVersion.uiSchema}
              />
            </span>
          </div>
        )}

        {/* if schema and team*/}
        {task.formVersion &&
          filteredTeamProjectMembers &&
          filteredTeamProjectMembers.length > 0 && (
            <div className="">
              {filteredTeamProjectMembers.map((teamProjectMember) => (
                <div key={teamProjectMember.id} className="mb-2 flex grid-col-2">
                  <CompleteSchema
                    taskLog={filterLatestTaskLog(teamProjectMember.taskLogAssignedTo)}
                    completedById={currentProjectMember?.id}
                    completedAs={CompletedAs.TEAM}
                    schema={task.formVersion?.schema}
                    ui={task.formVersion?.uiSchema}
                  />

                  <span className="mx-2">
                    <TaskLogHistoryModal
                      taskLogs={teamProjectMember.taskLogAssignedTo}
                      schema={task.formVersion?.schema}
                      ui={task.formVersion?.uiSchema}
                    />
                  </span>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}
