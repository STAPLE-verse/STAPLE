import { Routes } from "@blitzjs/next"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { TeamTaskListData } from "../processing/processTeamTaskList"
import { ApproveDropdown } from "src/tasklogs/components/ApproveTask"
import AssignmentHistoryModal from "src/tasklogs/components/TaskLogHistoryModal"

const columnHelper = createColumnHelper<TeamTaskListData>()

export const TeamTaskListColumns = [
  columnHelper.accessor("completedBy", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Completed By",
    id: "completedBy",
  }),
  columnHelper.accessor("taskName", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Task Name",
    id: "taskName",
  }),
  columnHelper.accessor("roles", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Roles",
    id: "roles",
  }),
  // change this to task history
  columnHelper.accessor("taskHistory", {
    cell: (info) => (
      <AssignmentHistoryModal
        taskLogs={info.row.original.taskHistory}
        schema={info.row.original.taskHistory.schema}
        ui={info.row.original.taskHistory.ui}
      />
    ),
    header: "Task History",
    id: "taskHistory",
  }),
  // add approval for latest log
  columnHelper.accessor("approved", {
    cell: (info) => (
      <ApproveDropdown
        value={info.getValue()}
        onChange={(newValue) => {}}
        taskLogId={info.row.original.id}
      />
    ),
    header: "Approved",
    id: "approved",
  }),
  columnHelper.accessor("deadline", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Deadline",
    id: "deadline",
  }),
  columnHelper.accessor("taskId", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-ghost"
        href={Routes.TaskLogsPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        <MagnifyingGlassIcon width={25} className="stroke-primary" />
      </Link>
    ),
  }),
]
