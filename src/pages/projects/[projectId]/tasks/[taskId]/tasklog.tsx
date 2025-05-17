import { Suspense, useState } from "react"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import { Routes, useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { TaskLogCompleteColumns } from "src/tasklogs/tables/columns/TaskLogCompleteColumns"
import Table from "src/core/components/Table"
import Link from "next/link"
import TaskLayout from "src/core/layouts/TaskLayout"
import { useTaskContext } from "src/tasks/components/TaskContext"
import { ProjectMemberWithTaskLog } from "src/core/types"
import {
  processIndividualTaskLogs,
  processTeamTaskLogs,
} from "src/tasklogs/tables/processing/processTaskLogs"
import { useSeparateProjectMembers } from "src/projectmembers/hooks/useSeparateProjectMembers"
import { TaskLogFormColumns } from "src/tasklogs/tables/columns/TaskLogFormColumns"
import Card from "src/core/components/Card"
import { filterFirstTaskLog } from "src/tasklogs/utils/filterFirstTaskLog"
import { useQuery } from "@blitzjs/rpc"
import getComments from "src/comments/queries/getComments"
import Modal from "src/core/components/Modal"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"

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
  const projectId = useParam("projectId", "number")
  const { projectMember: currentContributor } = useCurrentContributor(projectId)

  const { individualProjectMembers, teamProjectMembers } =
    useSeparateProjectMembers<ProjectMemberWithTaskLog>(projectMembers)

  const [openModal, setOpenModal] = useState(false)

  // Fetch all comments for task logs
  // Fetch all first task log IDs for teams
  const firstTaskLogIds = [
    ...individualProjectMembers.map((member) => filterFirstTaskLog(member.taskLogAssignedTo)?.id),
    ...teamProjectMembers.map((team) => filterFirstTaskLog(team.taskLogAssignedTo)?.id),
  ].filter((id): id is number => id !== undefined) // Remove undefined values

  const [comments, { refetch: refetchComments }] = useQuery(getComments, {
    where: { taskLogId: { in: firstTaskLogIds } },
  })

  // Preprocess taskLogs to include only the latest log
  const processedIndividualAssignments = processIndividualTaskLogs(
    individualProjectMembers,
    comments,
    task.name,
    currentContributor!.id,
    task.formVersion?.schema,
    task.formVersion?.uiSchema,
    refetchComments,
    task.deadline
  )
  const processedTeamAssignments = processTeamTaskLogs(
    teamProjectMembers,
    comments,
    task.name,
    currentContributor!.id,
    task.formVersion?.schema,
    task.formVersion?.uiSchema,
    refetchComments,
    task.deadline
  )

  // Get columns definitions for tables
  const individualColumns = task.formVersionId ? TaskLogFormColumns : TaskLogCompleteColumns
  //const teamColumns = task.formVersionId ? TeamTaskLogFormColumns : TeamTaskLogCompleteColumns

  return (
    <main className="flex flex-col mb-2 mt-2 mx-auto w-full">
      <h1 className="text-3xl flex justify-center items-center gap-2 mb-2">
        Edit Responses: <span className="truncate max-w-xs italic">{task.name}</span>
        <InformationCircleIcon
          className="h-5 w-5 stroke-2 text-info"
          data-tooltip-id="tasklog-review-tooltip"
        />
        <Tooltip
          id="tasklog-review-tooltip"
          content="Use this page to review collaborators' answers to the form data you assigned them, edit the responses, or click the download button to access the download page."
          className="z-[1099] ourtooltips"
        />
      </h1>

      <div className="flex flex-row justify-center gap-2 mt-2 mb-2">
        <>
          <button className="btn btn-primary" onClick={() => setOpenModal(true)}>
            Task Description
          </button>
          <Modal open={openModal} size="large">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold flex gap-2 justify-center items-center mb-4">
                Task Description
              </h2>
              <p className="whitespace-pre-wrap">
                Description:{" "}
                {task.description ? (
                  task.description
                ) : (
                  <span className="italic">None Provided</span>
                )}
              </p>
              <p className="whitespace-pre-wrap">
                Due Date:{" "}
                {task.deadline ? task.deadline : <span className="italic">None Provided</span>}
              </p>
              <div className="flex justify-end mt-4">
                <button className="btn btn-primary" onClick={() => setOpenModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </Modal>
        </>
        <Link
          className="btn btn-secondary"
          href={Routes.EditTaskPage({
            projectId: task.projectId as number,
            taskId: task.id as number,
          })}
        >
          Edit Task
        </Link>
        {task.formVersionId && (
          <Link
            className="btn btn-info"
            href={Routes.ShowMetadataPage({
              projectId: task.projectId as number,
              taskId: task.id as number,
            })}
          >
            Go to Download
          </Link>
        )}
        <Link
          className="btn btn-success"
          href={Routes.ShowTaskPage({ projectId: task.projectId, taskId: task.id })}
        >
          Go to Task
        </Link>
      </div>

      {/* Contributors (merged individual and team assignments) */}
      <TaskLogSection
        title="Contributors"
        data={[...processedIndividualAssignments, ...processedTeamAssignments]}
        columns={individualColumns}
        fallbackMessage="This task does not have any contributors"
      />
    </main>
  )
}

export const TaskLogsPage = () => {
  return (
    // @ts-expect-error children are clearly passed below
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
