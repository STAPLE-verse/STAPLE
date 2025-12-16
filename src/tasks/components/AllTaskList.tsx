import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import { processAllTasks } from "../tables/processing/processAllTasks"
import Table from "src/core/components/Table"
import { AllTasksColumns } from "../tables/columns/AllTasksColumns"
import { TaskLogWithTaskProjectAndComments } from "src/core/types"
import Card from "src/core/components/Card"
import { useState } from "react"
import { PaginationState } from "@tanstack/react-table"

export const AllTasksList = () => {
  const currentUser = useCurrentUser()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [{ tasks, count }] = usePaginatedQuery(getTasks, {
    where: {
      taskLogs: {
        some: {
          assignedTo: {
            users: {
              some: { id: currentUser?.id },
            },
          },
        },
      },
    },
    include: {
      project: true,
      taskLogs: {
        where: {
          assignedTo: {
            users: {
              some: { id: currentUser?.id },
            },
          },
        },
        include: {
          assignedTo: {
            include: {
              users: true,
            },
          },
          comments: {
            include: {
              commentReadStatus: {
                include: {
                  projectMember: {
                    include: {
                      users: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { id: "asc" },
    skip: pagination.pageIndex * pagination.pageSize,
    take: pagination.pageSize,
  })

  const taskLogs: TaskLogWithTaskProjectAndComments[] = tasks.flatMap((task) => {
    const { taskLogs: taskLogsForTask, ...taskWithoutLogs } = task
    return taskLogsForTask.map((log) => ({
      ...log,
      task: taskWithoutLogs,
    })) as TaskLogWithTaskProjectAndComments[]
  })

  // process those logs to get the latest one for each task-projectmemberId
  const latestLogs = getLatestTaskLogs<TaskLogWithTaskProjectAndComments>(taskLogs)

  // process both sets so that comment counts use original taskLogs (first log for each person-task combo)
  const processedTasks = processAllTasks(latestLogs, taskLogs)

  const pageCount = Math.max(1, Math.ceil((count ?? 0) / pagination.pageSize))

  const handlePaginationChange = (
    updater: PaginationState | ((state: PaginationState) => PaginationState)
  ) => {
    setPagination((prev) => (typeof updater === "function" ? updater(prev) : updater))
  }

  return (
    <Card title="">
      <div className="overflow-y-auto">
        <Table
          columns={AllTasksColumns}
          data={processedTasks}
          addPagination={true}
          manualPagination={true}
          paginationState={pagination}
          onPaginationChange={handlePaginationChange}
          pageCount={pageCount}
          pageSizeOptions={[10, 25, 50, 100]}
        />
        <span className="italic">
          Note: This list only shows comment notifications for tasks that are explicitly assigned to
          you. If you are a project manager but not assigned to a task, you will not see its comment
          notifications here. Those comments will appear on the main dashboard and project task page
          instead.
        </span>
      </div>
    </Card>
  )
}
