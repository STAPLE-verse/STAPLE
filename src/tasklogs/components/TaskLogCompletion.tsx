import { Tooltip } from "react-tooltip"
import AssignmentHistoryModal from "./TaskLogHistoryModal"
import CompleteSchema from "./CompleteSchema"
import CompleteToggle from "./CompleteToggle"
import { CompletedAs } from "db"
import { useTaskContext } from "src/tasks/components/TaskContext"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useCurrentProjectMember } from "src/projectmembers/hooks/useCurrentProjectMember"
import TaskLogHistoryModal from "./TaskLogHistoryModal"
import groupTeamTaskLogs from "../utils/groupTeamTaskLogs"

export const TaskLogCompletion = () => {
  const { task, individualTaskLogs, teamTaskLogs } = useTaskContext()
  const { projectMember: currentProjectMember } = useCurrentProjectMember(task.projectId)
  const currentUser = useCurrentUser()

  // Filter based on the currentUser
  const filteredIndividualTaskLogs = individualTaskLogs.filter((taskLog) =>
    taskLog.assignedTo?.users.some((user) => user.id === currentUser?.id)
  )

  const latestIndividualTaskLog =
    filteredIndividualTaskLogs.length > 0
      ? filteredIndividualTaskLogs.reduce((latest, current) => {
          return latest.createdAt > current.createdAt ? latest : current
        }, filteredIndividualTaskLogs[0])
      : null

  const filteredTeamTaskLogs = teamTaskLogs.filter((taskLog) =>
    taskLog.assignedTo?.users.some((user) => user.id === currentUser?.id)
  )

  const groupedTeamTaskLogs = groupTeamTaskLogs(filteredTeamTaskLogs)
  console.log(groupedTeamTaskLogs)
  return (
    <div className="card bg-base-300 mx-2 w-1/2">
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
        {!task.formVersion &&
          filteredIndividualTaskLogs &&
          filteredIndividualTaskLogs.length > 0 && (
            <div className="flex grid-col-2">
              <CompleteToggle
                taskLog={latestIndividualTaskLog}
                completedRole="Completed"
                completedById={currentProjectMember?.id}
                completedAs={CompletedAs.INDIVIDUAL}
              />
              <span className="mx-2">
                <TaskLogHistoryModal taskLogs={filteredIndividualTaskLogs} />
              </span>
            </div>
          )}

        {/* if no schema complete task as a Team*/}
        {/* {!task.formVersion && teamTaskLogs && teamTaskLogs.length > 0 && (
          <div>
            {teamTaskLogs.map((teamTaskLog) => (
              <div key={teamTaskLog.id} className="flex flex-col gap-2">
                <CompleteToggle
                  taskLog={teamAssignment}
                  completedRole="Completed"
                  completedById={currentProjectMember?.id}
                  completedAs={CompletedAs.TEAM}
                />
                <span className="mx-2">
                  <AssignmentHistoryModal taskLogs={teamAssignment.statusLogs!} />
                </span>
              </div>
            ))}
          </div>
        )} */}

        {/* if schema and individual*/}
        {task.formVersion &&
          filteredIndividualTaskLogs &&
          filteredIndividualTaskLogs.length > 0 && (
            <div className="flex grid-col-2">
              <CompleteSchema
                taskLog={latestIndividualTaskLog}
                completedById={currentProjectMember?.id}
                completedAs={CompletedAs.INDIVIDUAL}
                schema={task.formVersion.schema}
                ui={task.formVersion.uiSchema}
              />
              <span className="mx-2">
                <TaskLogHistoryModal
                  taskLogs={filteredIndividualTaskLogs}
                  schema={task.formVersion.schema}
                  ui={task.formVersion.uiSchema}
                />
              </span>
            </div>
          )}

        {/* if schema and team*/}
        {/* {task.formVersion && teamTaskLogs && teamTaskLogs.length > 0 && (
          <div className="">
            {teamTaskLogs.map((teamAssignment) => (
              <div key={teamAssignment.id} className="mb-2 flex grid-col-2">
                <CompleteSchema
                  currentAssignment={teamAssignment}
                  completedBy={currentProjectMember?.id}
                  completedAs={CompletedAs.TEAM}
                  schema={task.formVersion?.schema}
                  ui={task.formVersion?.uiSchema}
                />

                <span className="mx-2">
                  <AssignmentHistoryModal
                    assignmentStatusLog={teamAssignment.statusLogs!}
                    schema={task.formVersion?.schema}
                    ui={task.formVersion?.uiSchema}
                  />
                </span>
              </div>
            ))}
          </div>
        )} */}
      </div>
    </div>
  )
}
