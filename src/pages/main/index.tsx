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
import getNotifications from "src/messages/queries/getNotifications"
import { notificationTableColumns } from "src/messages/components/notificationTable"

// make things draggable
import React, { useState } from "react"
import {
  DndContext,
  KeyboardSensor,
  TouchSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import { SortableBox } from "src/core/components/SortableBox.tsx"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"

type TaskWithProjectName = Prisma.TaskGetPayload<{
  include: { project: { select: { name: true } } }
}>

//column information
const taskColumnHelper = createColumnHelper<TaskWithProjectName>()
const tasksColumns: ColumnDef<TaskWithProjectName>[] = [
  taskColumnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
    enableColumnFilter: false,
  }),
  taskColumnHelper.accessor((row) => row.project.name, {
    cell: (info) => <span>{info.getValue()}</span>,
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

const projectColumnHelper = createColumnHelper<Project>()
const projectColumns: ColumnDef<Project>[] = [
  projectColumnHelper.accessor("name", {
    cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
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

const notificationColumnHelper = createColumnHelper<Notifications>()
const notificationColumns: ColumnDef<Notifications>[] = [
  notificationColumnHelper.accessor("message", {
    cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
    header: "Message",
    enableColumnFilter: false,
  }),
  projectColumnHelper.accessor("createdAt", {
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

//start page
const MainPage = () => {
  const sidebarItems = HomeSidebarItems("Dashboard")
  const currentUser = useCurrentUser()
  const today = moment().startOf("day")

  //variable definitions
  var upcomingDisplay = ""
  var pastDueDisplay = ""
  var noDeadlineDisplay = ""
  var projectsDisplay = ""
  var notificationsDisplay = ""
  var taskLink = (
    <Link className="btn btn-primary self-end m-4" href={Routes.AllTasksPage()}>
      {" "}
      Show all tasks{" "}
    </Link>
  )
  var projectLink = (
    <Link className="btn btn-primary self-end m-4" href={Routes.ProjectsPage()}>
      {" "}
      Show all projects{" "}
    </Link>
  )
  var notificationLink = (
    <Link className="btn btn-primary self-end m-4" href={Routes.NotificationsPage()}>
      {" "}
      Show all notifications{" "}
    </Link>
  )

  // get all tasks
  const [{ tasks }] = useQuery(getTasks, {
    include: {
      project: { select: { name: true } },
    },
    where: {
      assignees: { some: { contributor: { user: { id: currentUser?.id } } } },
      //deadline: {
      // TODO: return all not completed tasks even with due date
      //gte: today.toDate(),
      //lt: moment(tomorrow).add(1, "days").toDate(),
      //},
      status: TaskStatus.NOT_COMPLETED,
    },
    orderBy: { id: "desc" },
  })

  // get only upcoming
  const upcomingTasks = tasks.filter((task) => {
    if (task && task.deadline) {
      return moment(task.deadline).isSameOrAfter(today, "day")
    }
    return false
  })

  // get no deadline
  const noDeadlineTasks = tasks.filter((task) => {
    if (task && task.deadline === null) {
      return moment(task.deadline)
    }
    return false
  })

  // get pastDue
  const pastDueTasks = tasks.filter((task) => {
    if (task && task.deadline) {
      return moment(task.deadline).isBefore(moment(), "minute")
    }
    return false
  })

  // get all projects
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

  // get all notifications
  const [{ notifications }] = useQuery(getNotifications, {
    where: {
      recipients: {
        some: {
          id: currentUser!.id,
        },
      },
      read: false,
    },
    orderBy: { id: "desc" },
    take: 3,
  })

  // displays
  if (upcomingTasks.length === 0) {
    upcomingDisplay = <p className="italic p-2">No upcoming tasks</p>
  } else {
    upcomingDisplay = (
      <Table
        columns={tasksColumns}
        data={upcomingTasks}
        classNames={{
          thead: "text-sm text-base-content",
          tbody: "text-sm text-base-content",
          td: "text-sm text-base-content",
        }}
      />
    )
  }

  if (pastDueTasks.length === 0) {
    pastDueDisplay = <p className="italic p-2">No overdue tasks</p>
  } else {
    pastDueDisplay = (
      <Table
        columns={tasksColumns}
        data={pastDueTasks}
        classNames={{
          thead: "text-sm text-base-content",
          tbody: "text-sm text-base-content",
          td: "text-sm text-base-content",
        }}
      />
    )
  }

  if (projects.length === 0) {
    projectsDisplay = <p className="italic p-2">No projects</p>
  } else {
    projectsDisplay = (
      <Table
        columns={projectColumns}
        data={projects}
        classNames={{
          thead: "text-sm text-base-content",
          tbody: "text-sm text-base-content",
          td: "text-sm text-base-content",
        }}
      />
    )
  }

  if (pastDueTasks.length === 0) {
    pastDueDisplay = <p className="italic p-2">No overdue tasks</p>
  } else {
    pastDueDisplay = (
      <Table
        columns={tasksColumns}
        data={pastDueTasks}
        classNames={{
          thead: "text-sm text-base-content",
          tbody: "text-sm text-base-content",
          td: "text-sm text-base-content",
        }}
      />
    )
  }

  if (notifications.length === 0) {
    notificationsDisplay = <p className="italic p-2">No unread notifications</p>
  } else {
    notificationsDisplay = (
      <Table
        columns={notificationColumns}
        data={notifications}
        classNames={{
          thead: "text-sm text-base-content",
          tbody: "text-sm text-base-content",
          td: "text-sm text-base-content",
        }}
      />
    )
  }

  // make things drag and droppable
  const [boxes, setBoxes] = useState([
    { id: 1, title: "Upcoming Tasks", display: upcomingDisplay, link: taskLink },
    { id: 2, title: "Overdue Tasks", display: pastDueDisplay, link: taskLink },
    { id: 3, title: "Last Updated Projects", display: projectsDisplay, link: taskLink },
    { id: 4, title: "Notifications", display: notificationsDisplay, link: notificationLink },
  ])

  const getBoxesPos = (id) => boxes.findIndex((boxes) => boxes.id === id)

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id === over.id) return

    setBoxes((boxes) => {
      const originalPos = getBoxesPos(active.id)
      const newPos = getBoxesPos(over.id)

      return arrayMove(boxes, originalPos, newPos)
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>Home</title>
      </Head>

      <Suspense fallback={<div>Loading...</div>}>
        <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl h-full space-y-4">
          <div className="mb-4">
            <h3 className="text-3xl">Welcome, {currentUser!.username}!</h3>
          </div>

          <DndContext
            collisionDectection={closestCorners}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableBox boxes={boxes} />
          </DndContext>
        </main>
      </Suspense>
    </Layout>
  )
}

export default MainPage
