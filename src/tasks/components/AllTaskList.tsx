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
import { ColumnFiltersState, PaginationState } from "@tanstack/react-table"

type TaskWithLogs = TaskLogWithTaskProjectAndComments["task"] & {
  taskLogs: TaskLogWithTaskProjectAndComments[]
}

export const AllTasksList = () => {
  const currentUser = useCurrentUser()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [search, setSearch] = useState("")
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const nameFilter = columnFilters.find((f) => f.id === "name")?.value as string | undefined
  const projectNameFilter = columnFilters.find((f) => f.id === "projectName")?.value as
    | string
    | undefined

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
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { project: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
      ...(nameFilter ? { name: { contains: nameFilter, mode: "insensitive" } } : {}),
      ...(projectNameFilter ? { project: { name: projectNameFilter } } : {}),
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

  const typedTasks = tasks as TaskWithLogs[]
  const taskLogs: TaskLogWithTaskProjectAndComments[] = typedTasks.flatMap((task) => {
    const { taskLogs: taskLogsForTask, ...taskWithoutLogs } = task
    return taskLogsForTask.map((log) => ({
      ...log,
      task: taskWithoutLogs,
    }))
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

  const handleGlobalFilterChange = (filter: string) => {
    setSearch(filter)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleColumnFiltersChange = (filters: ColumnFiltersState) => {
    setColumnFilters(filters)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
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
          onGlobalFilterChange={handleGlobalFilterChange}
          onColumnFiltersChange={handleColumnFiltersChange}
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
