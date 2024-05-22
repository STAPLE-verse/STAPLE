import { Routes } from "@blitzjs/next"
import { Prisma, Project, Notification } from "@prisma/client"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"

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
        {info.getValue()
          ? info.getValue()?.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false, // Use 24-hour format
            })
          : "No Deadline"}
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
    cell: (info) => (
      <span>
        {info.getValue()?.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // Use 24-hour format
        })}
      </span>
    ),
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
  }),
  notificationColumnHelper.accessor("createdAt", {
    cell: (info) => (
      <span>
        {info.getValue()?.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // Use 24-hour format
        })}
      </span>
    ),
    header: "Posted",
    enableColumnFilter: false,
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
  },
  {
    accessorKey: "user.firstName",
    cell: (info) => <span>{info.getValue() as string}</span>,
    header: "First Name",
  },
  {
    accessorKey: "user.lastName",
    cell: (info) => <span>{info.getValue() as string}</span>,
    header: "Last Name",
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
const projectTaskColumnHelper = createColumnHelper<Tasks>()
const projectTaskColumns: ColumnDef<Tasks>[] = [
  projectTaskColumnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
  }),
  projectTaskColumnHelper.accessor("deadline", {
    cell: (info) => (
      <span>
        {" "}
        {info.getValue()
          ? info.getValue()?.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false, // Use 24-hour format
            })
          : "No Deadline"}
      </span>
    ),
    header: "Deadline",
  }),
  projectTaskColumnHelper.accessor("id", {
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
  }),
]
