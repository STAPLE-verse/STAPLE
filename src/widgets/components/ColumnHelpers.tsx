import { Routes } from "@blitzjs/next"
import { Prisma, Project, Notification, Task } from "@prisma/client"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import DateFormat from "src/core/components/DateFormat"

// Tasks table
type TaskWithProjectName = Prisma.TaskGetPayload<{
  include: { project: { select: { name: true } } }
}>
const taskColumnHelper = createColumnHelper<TaskWithProjectName>()
export const tasksColumns: ColumnDef<TaskWithProjectName>[] = [
  taskColumnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
    enableColumnFilter: false,
  }),
  taskColumnHelper.accessor((row) => row.project.name, {
    cell: (info) => <span>{info.getValue()} </span>,
    header: "Project",
    enableColumnFilter: false,
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
  }),
  taskColumnHelper.accessor("id", {
    id: "view",
    header: "View",
    cell: (info) => (
      <Link
        className="btn btn-sm btn-secondary"
        href={Routes.ShowTaskPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        View
      </Link>
    ),
    enableColumnFilter: false,
  }),
]

// Projects table
const projectColumnHelper = createColumnHelper<Project>()
export const projectColumns: ColumnDef<Project>[] = [
  projectColumnHelper.accessor("name", {
    cell: (info) => <span className="font-semibold"> {info.getValue()} </span>,
    header: "Name",
    enableColumnFilter: false,
  }),
  projectColumnHelper.accessor("updatedAt", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Updated",
    enableColumnFilter: false,
  }),
  projectColumnHelper.accessor("id", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-sm btn-secondary"
        href={Routes.ShowProjectPage({
          projectId: info.getValue(),
        })}
      >
        View
      </Link>
    ),
  }),
]

// Notifciation table
const notificationColumnHelper = createColumnHelper<Notification>()
export const notificationColumns: ColumnDef<Notification>[] = [
  notificationColumnHelper.accessor("message", {
    cell: (info) => <div dangerouslySetInnerHTML={{ __html: info.getValue() }} />,
    header: "Message",
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
type ContributorWithUser = Prisma.ContributorGetPayload<{
  include: { user: { select: { username: true; firstName: true; lastName: true } } }
}>
export const projectManagersColumns: ColumnDef<ContributorWithUser>[] = [
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
const projectTaskColumnHelper = createColumnHelper<Task>()
export const projectTaskColumns: ColumnDef<Task>[] = [
  projectTaskColumnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
    enableSorting: false,
    enableColumnFilter: false,
  }),
  projectTaskColumnHelper.accessor("deadline", {
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
  projectTaskColumnHelper.accessor("id", {
    id: "view",
    header: "View",
    enableSorting: false,
    enableColumnFilter: false,
    cell: (info) => (
      <Link
        className="btn btn-sm btn-secondary"
        href={Routes.ShowTaskPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        View
      </Link>
    ),
  }),
]
