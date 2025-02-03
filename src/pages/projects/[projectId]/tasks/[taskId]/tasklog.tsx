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
import Card from "src/core/components/Card"
import { filterFirstTaskLog } from "src/tasklogs/utils/filterFirstTaskLog"
import { useQuery } from "@blitzjs/rpc"
import getComments from "src/comments/queries/getComments"

const TaskLogSection = ({ title, data, columns, fallbackMessage }: any) => (
  <Card title={title} className="w-full overflow-x-auto">
    {data.length > 0 ? (
      <Table columns={columns} data={data} addPagination={true} />
    ) : (
      <span>{fallbackMessage}</span>
    )}
  </Card>
)

const TaskLogContent = () => {
  // Get values
  const { task, projectMembers } = useTaskContext()
  const { individualProjectMembers, teamProjectMembers } =
    useSeparateProjectMembers<ProjectMemberWithTaskLog>(projectMembers)

  // Fetch all comments for task logs
  // Fetch all first task log IDs for teams
  const firstTaskLogIds = [
    ...individualProjectMembers.map((member) => filterFirstTaskLog(member.taskLogAssignedTo)?.id),
    ...teamProjectMembers.map((team) => filterFirstTaskLog(team.taskLogAssignedTo)?.id),
  ].filter((id): id is number => id !== undefined) // Remove undefined values

  const [comments] = useQuery(getComments, {
    where: { taskLogId: { in: firstTaskLogIds } },
  })

  // Preprocess taskLogs to include only the latest log
  const processedIndividualAssignments = processIndividualTaskLogs(
    individualProjectMembers,
    comments
  )
  const processedTeamAssignments = processTeamTaskLogs(teamProjectMembers, comments)

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

      {/* Individual Contributors */}
      <TaskLogSection
        title="Individual Contributors"
        data={processedIndividualAssignments}
        columns={individualColumns}
        fallbackMessage="This task does not have individual contributors"
      />

      {/* Team Contributors */}
      <TaskLogSection
        title="Team Contributors"
        data={processedTeamAssignments}
        columns={teamColumns}
        fallbackMessage="This task does not have teams of contributors"
      />
    </main>
  )
}

export const TaskLogsPage = () => {
  return (
    <Layout>
      <TaskLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <TaskLogContent />
        </Suspense>
      </TaskLayout>
    </Layout>
  )
}

TaskLogsPage.authenticate = true

export default TaskLogsPage
