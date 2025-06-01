import { Routes } from "@blitzjs/next"
import { ChatBubbleOvalLeftEllipsisIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Prisma, Notification, Task, TaskLog } from "@prisma/client"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import NotificationMessage from "src/notifications/components/NotificationMessage"
import Link from "next/link"
import DateFormat from "src/core/components/DateFormat"
import { ProjectWithNewCommentsCount } from "src/core/types"

// Tasks table
type TaskWithProject = Prisma.TaskGetPayload<{
  include: {
    project: true
  }
}>
const taskColumnHelper = createColumnHelper<TaskWithProject>()
export const tasksColumns: ColumnDef<TaskWithProject>[] = [
  taskColumnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
    enableColumnFilter: false,
    enableSorting: false,
  }),
  taskColumnHelper.accessor((row) => row.project.name, {
    cell: (info) => <span>{info.getValue()} </span>,
    header: "Project",
    enableColumnFilter: false,
    enableSorting: false,
  }),
  taskColumnHelper.accessor("deadline", {
    cell: (info) => (
      <span>
        {" "}
        {info.getValue() ? (
          <DateFormat date={info.getValue() || undefined}></DateFormat>
        ) : (
          "No Deadline"
        )}
      </span>
    ),
    header: "Deadline",
    enableColumnFilter: false,
    enableSorting: false,
  }),
  taskColumnHelper.accessor("id", {
    id: "view",
    header: "View",
    cell: (info) => (
      <Link
        className="btn btn-sm btn-ghost"
        href={Routes.ShowTaskPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        <MagnifyingGlassIcon width={25} className="stroke-secondary" />
      </Link>
    ),
    enableColumnFilter: false,
    enableSorting: false,
  }),
]

// Projects table
const projectColumnHelper = createColumnHelper<ProjectWithNewCommentsCount>()
export const projectColumns: ColumnDef<ProjectWithNewCommentsCount>[] = [
  projectColumnHelper.accessor("name", {
    cell: (info) => <span className="font-semibold"> {info.getValue()} </span>,
    header: "Name",
    enableColumnFilter: false,
    enableSorting: false,
  }),
  projectColumnHelper.accessor("updatedAt", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Updated",
    enableColumnFilter: false,
    enableSorting: false,
  }),
  projectColumnHelper.accessor("newCommentsCount", {
    id: "newComments",
    header: "Comments",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <div className="relative flex items-center justify-center w-fit">
        <ChatBubbleOvalLeftEllipsisIcon
          className={`h-7 w-7 ${info.getValue() > 0 ? "text-primary" : "opacity-30"}`}
        />
        {info.getValue() > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
            {info.getValue()}
          </span>
        )}
      </div>
    ),
  }),
  projectColumnHelper.accessor("id", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-sm btn-ghost"
        href={Routes.ShowProjectPage({
          projectId: info.getValue(),
        })}
      >
        <MagnifyingGlassIcon width={25} className="stroke-secondary" />
      </Link>
    ),
  }),
]

// Notifciation table
const notificationColumnHelper = createColumnHelper<Notification>()
export const notificationColumns: ColumnDef<Notification>[] = [
  notificationColumnHelper.accessor("message", {
    header: "Message",
    cell: (info) => (
      <NotificationMessage
        message={info.getValue()}
        routeData={(info.row.original as any).routeData}
      />
    ),
    enableColumnFilter: false,
    enableSorting: false,
  }),
  notificationColumnHelper.accessor("createdAt", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Date",
    enableColumnFilter: false,
    enableSorting: false,
  }),
]

// project Managers
type ProjectMemberWithUser = Prisma.ProjectMemberGetPayload<{
  include: {
    users: {
      select: {
        username: true
        firstName: true
        lastName: true
      }
    }
  }
}>
export const projectManagersColumns: ColumnDef<ProjectMemberWithUser>[] = [
  {
    accessorKey: "user.username",
    cell: (info) => <span>{info.getValue() as string}</span>,
    header: "Username",
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "user.firstName",
    cell: (info) => <span>{info.getValue() as string}</span>,
    header: "First Name",
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "user.lastName",
    cell: (info) => <span>{info.getValue() as string}</span>,
    header: "Last Name",
    enableColumnFilter: false,
    enableSorting: false,
  },
  //  { // email PM coming later
  //    accessorKey: "action",
  //    header: "Contact",
  //    cell: (info) => (
  //      <Link className="btn btn-sm btn-secondary" href="">
  //        Ask for help
  //      </Link>
  //    ),
  //  },
]

//past due project Tasks
type TaskLogWithTask = TaskLog & {
  task: Task
}
const projectTaskColumnHelper = createColumnHelper<TaskLogWithTask>()
export const projectTaskColumns: ColumnDef<TaskLogWithTask>[] = [
  projectTaskColumnHelper.accessor("task.name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
    enableSorting: false,
    enableColumnFilter: false,
  }),
  projectTaskColumnHelper.accessor("task.deadline", {
    cell: (info) => (
      <span>
        {" "}
        {info.getValue() ? (
          <DateFormat date={info.getValue() || undefined}></DateFormat>
        ) : (
          "No Deadline"
        )}
      </span>
    ),
    header: "Deadline",
    enableSorting: false,
    enableColumnFilter: false,
  }),
  projectTaskColumnHelper.accessor("taskId", {
    id: "view",
    header: "View",
    enableSorting: false,
    enableColumnFilter: false,
    cell: (info) => (
      <Link
        className="btn btn-sm btn-ghost"
        href={Routes.ShowTaskPage({
          projectId: info.row.original.task.projectId,
          taskId: info.getValue(),
        })}
      >
        <MagnifyingGlassIcon width={25} className="stroke-secondary" />
      </Link>
    ),
  }),
]
