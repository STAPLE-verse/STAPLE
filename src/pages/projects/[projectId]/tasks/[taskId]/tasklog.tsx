import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { TaskLogCompleteColumns } from "src/tasklogs/tabels/columns/TaskLogCompleteColumns"
import Table from "src/core/components/Table"
import Link from "next/link"
import TaskLayout from "src/core/layouts/TaskLayout"
import { ProjectMemberWithTaskLog, useTaskContext } from "src/tasks/components/TaskContext"
import {
  processIndividualTaskLogs,
  processTeamTaskLogs,
} from "src/tasklogs/tabels/processing/processTaskLogs"
import { useSeparateProjectMembers } from "src/projectmembers/hooks/useSeparateProjectMembers"
import { TaskLogFormColumns } from "src/tasklogs/tabels/columns/TaskLogFormColumns"
import { TeamTaskLogFormColumns } from "src/tasklogs/tabels/columns/TeamTaskLogFormColumns"
import { TeamTaskLogCompleteColumns } from "src/tasklogs/tabels/columns/TeamTaskLogCompleteColumns"

const AssignmentsContent = () => {
  // Get values
  const { task, projectMembers } = useTaskContext()
  const { individualProjectMembers, teamProjectMembers } =
    useSeparateProjectMembers<ProjectMemberWithTaskLog>(projectMembers)

  // Preprocess assignments to include only the latest log
  const processedIndividualAssignments = processIndividualTaskLogs(individualProjectMembers)
  const processedTeamAssignments = processTeamTaskLogs(teamProjectMembers)

  // Get columns definitions for tables
  const individualColumns = task.formVersionId ? TaskLogFormColumns : TaskLogCompleteColumns
  const teamColumns = task.formVersionId ? TeamTaskLogFormColumns : TeamTaskLogCompleteColumns

  return (
    <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">Review and Complete Tasks</h1>

      <div className="flex flex-row justify-center">
        <div className="card bg-base-300 w-full">
          <div className="card-body overflow-x-auto">
            <div className="card-title">{task.name}</div>
            {task.description}
            <div className="card-actions justify-end">
              <Link
                className="btn btn-primary"
                href={Routes.EditTaskPage({
                  projectId: task.projectId as number,
                  taskId: task.id as number,
                })}
              >
                Edit Task
              </Link>
              {task.formVersionId && (
                <Link
                  className="btn btn-secondary mx-2"
                  href={Routes.ShowMetadataPage({
                    projectId: task.projectId as number,
                    taskId: task.id as number,
                  })}
                >
                  Download Form Data
                </Link>
              )}
              <Link
                className="btn btn-secondary self-end"
                href={Routes.ShowTaskPage({ projectId: task.projectId, taskId: task.id })}
              >
                Go back
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center mt-2">
        <div className="card bg-base-300 w-full">
          <div className="card-body overflow-x-auto">
            <div className="card-title">Individual Contributors</div>
            {processedIndividualAssignments.length > 0 ? (
              <Table
                columns={individualColumns}
                data={processedIndividualAssignments}
                addPagination={true}
              />
            ) : (
              <span>This task does not have individual contributors </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center mt-2">
        <div className="card bg-base-300 w-full">
          <div className="card-body overflow-x-auto">
            <div className="card-title">Team Contributors</div>
            {processedTeamAssignments.length > 0 ? (
              <Table columns={teamColumns} data={processedTeamAssignments} addPagination={true} />
            ) : (
              <span>This task does not have teams of contributors</span>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export const AssignmentsPage = () => {
  return (
    <Layout>
      <TaskLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <AssignmentsContent />
        </Suspense>
      </TaskLayout>
    </Layout>
  )
}

AssignmentsPage.authenticate = true

export default AssignmentsPage
