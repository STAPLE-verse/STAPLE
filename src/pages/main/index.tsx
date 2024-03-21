import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import getProjects from "src/projects/queries/getProjects"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import getTasks from "src/tasks/queries/getTasks"
import moment from "moment"
import Table from "src/core/components/Table"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { Prisma, Project, TaskStatus } from "db"

type TaskWithProjectName = Prisma.TaskGetPayload<{
  include: { project: { select: { name: true } } }
}>

const taskColumnHelper = createColumnHelper<TaskWithProjectName>()

// ColumnDefs
const tasksColumns: ColumnDef<TaskWithProjectName>[] = [
  taskColumnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
  }),
  taskColumnHelper.accessor((row) => row.project.name, {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Project",
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
  }),
  taskColumnHelper.accessor("id", {
    id: "view",
    header: "",
    cell: (info) => (
      <Link
        className="btn"
        href={Routes.ShowTaskPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        Open
      </Link>
    ),
  }),
]

const projectColumnHelper = createColumnHelper<Project>()

// ColumnDefs
const projectColumns: ColumnDef<Project>[] = [
  projectColumnHelper.accessor("name", {
    cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
    header: "Name",
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
    header: "Updated at",
  }),
  projectColumnHelper.accessor("id", {
    id: "view",
    header: "",
    cell: (info) => (
      <Link
        className="btn"
        href={Routes.ShowProjectPage({
          projectId: info.getValue(),
        })}
      >
        Open
      </Link>
    ),
  }),
]

const MainPage = () => {
  const sidebarItems = HomeSidebarItems("Dashboard")
  const currentUser = useCurrentUser()

  const today = moment().startOf("day")
  const tomorrow = moment(today).add(1, "days")

  const [{ tasks }] = useQuery(getTasks, {
    include: {
      project: { select: { name: true } },
    },
    where: {
      assignees: { some: { contributor: { user: { id: currentUser?.id } } } },
      deadline: {
        // TODO: return all not completed tasks even with due date
        // gte: today.toDate(),
        lt: moment(tomorrow).add(1, "days").toDate(),
      },
      status: TaskStatus.NOT_COMPLETED,
    },
    orderBy: { id: "asc" },
  })

  const todayTasks = tasks.filter((task) => {
    if (task && task.deadline) {
      return moment(task.deadline).isSame(today, "day")
    }
    return false
  })
  const tomorrowTasks = tasks.filter((task) => {
    if (task && task.deadline) {
      return moment(task.deadline).isSame(tomorrow, "day")
    }
    return false
  })
  const overdueTasks = tasks.filter((task) => {
    if (task && task.deadline) {
      return moment(task.deadline).isBefore(moment(), "minute")
    }
    return false
  })

  const [{ projects }] = useQuery(getProjects, {
    where: {
      contributors: {
        some: {
          userId: currentUser?.id,
        },
      },
    },
    orderBy: { updatedAt: "asc" },
    take: 3,
  })

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>Home</title>
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl h-full space-y-4">
          <div className="mb-4">
            <h3>Welcome, {currentUser!.username}!</h3>
            <p>Here is your agenda for today</p>
          </div>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col rounded bg-base-200 p-4 w-1/2">
              <h4>Upcoming tasks</h4>
              <div>
                <p className="font-semibold">Today</p>
                {todayTasks.length === 0 ? (
                  <p className="italic p-2">You have no tasks for today. Hurray!</p>
                ) : (
                  <Table
                    columns={tasksColumns}
                    data={todayTasks}
                    classNames={{
                      thead: "text-sm",
                      tbody: "text-sm",
                    }}
                  />
                )}
              </div>
              <div>
                <p className="font-semibold">Tomorrow</p>
                {tomorrowTasks.length === 0 ? (
                  <p className="italic p-2">You have no tasks for tomorrow. Hurray!</p>
                ) : (
                  <Table
                    columns={tasksColumns}
                    data={tomorrowTasks}
                    classNames={{
                      thead: "text-sm",
                      tbody: "text-sm",
                    }}
                  />
                )}
              </div>
              {/* TODO: add past due tasks */}
              <div>
                <p className="font-semibold">Tasks past due</p>
                {tomorrowTasks.length === 0 ? (
                  <p className="italic p-2">
                    You have completed all your tasks on time! Way to go!
                  </p>
                ) : (
                  <Table
                    columns={tasksColumns}
                    data={overdueTasks}
                    classNames={{
                      thead: "text-sm",
                      tbody: "text-sm",
                    }}
                  />
                )}
              </div>
              <Link className="btn self-end m-4" href={Routes.AllTasksPage()}>
                Show all tasks
              </Link>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col rounded bg-base-200 p-4 w-1/2">
              <h4>Latest projects</h4>
              <Table
                columns={projectColumns}
                data={projects}
                classNames={{
                  thead: "text-sm",
                  tbody: "text-sm",
                }}
              />
              <Link className="btn self-end m-4" href={Routes.ProjectsPage()}>
                Show all projects
              </Link>
            </div>
          </div>
        </main>
      </Suspense>
    </Layout>
  )
}

export default MainPage
