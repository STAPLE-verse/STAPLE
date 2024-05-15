// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Suspense, useEffect } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import getProjects from "src/projects/queries/getProjects"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import getTasks from "src/tasks/queries/getTasks"
import moment from "moment"
import Table from "src/core/components/Table"
import { TaskStatus } from "db"
import getNotifications from "src/messages/queries/getNotifications"
import {
  tasksColumns,
  projectColumns,
  notificationColumns,
} from "src/widgets/components/ColumnHelpers"
import getUserWidgets from "src/widgets/queries/getUserWidgets"

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
import { SortableBox } from "src/core/components/SortableBox"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import updateWidget from "src/widgets/mutations/updateWidget"

const projectLink = (
  <Link className="btn btn-primary self-end m-4" href={Routes.ProjectsPage()}>
    Show all projects
  </Link>
)

const taskLink = (
  <Link className="btn btn-primary self-end m-4" href={Routes.AllTasksPage()}>
    Show all tasks
  </Link>
)

const notificationLink = (
  <Link className="btn btn-primary self-end m-4" href={Routes.NotificationsPage()}>
    Show all notifications
  </Link>
)

// Define displays as functions to easily handle the fetching logic if necessary
const getProjectDisplay = (projects) => {
  if (projects.length === 0) {
    return <p className="italic p-2">No projects</p>
  }
  return (
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

const getUpcomingTaskDisplay = (upcomingTasks) => {
  if (upcomingTasks.length === 0) {
    return <p className="italic p-2">No upcoming tasks</p>
  }

  return (
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

const getOverdueTaskDisplay = (pastDueTasks) => {
  if (pastDueTasks.length === 0) {
    return <p className="italic p-2">No overdue tasks</p>
  }

  return (
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

const getNotificationDisplay = (notifications) => {
  if (notifications.length === 0) {
    return <p className="italic p-2">No unread notifications</p>
  }

  return (
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

const MainPage = () => {
  const sidebarItems = HomeSidebarItems("Dashboard")
  const currentUser = useCurrentUser()
  const today = moment().startOf("day")
  const [updateWidgetMutation] = useMutation(updateWidget)

  // Get data
  // get all tasks
  const [{ tasks }] = useQuery(getTasks, {
    include: {
      project: { select: { name: true } },
    },
    where: {
      assignees: { some: { contributor: { user: { id: currentUser?.id } } } },
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

  // Get the widgets for the user
  const [fetchedWidgets] = useQuery(getUserWidgets, {
    userId: currentUser?.id,
  })

  const [boxes, setBoxes] = useState([])

  useEffect(() => {
    if (fetchedWidgets) {
      const sortedWidgets = fetchedWidgets.sort((a, b) => a.position - b.position)
      const updatedBoxes = sortedWidgets.map((widget) => {
        switch (widget.type) {
          case "LastProject":
            return {
              id: widget.id,
              title: "Last Updated Projects",
              display: getProjectDisplay(projects),
              link: projectLink,
              position: widget.position,
            }
          case "Notifications":
            return {
              id: widget.id,
              title: "Notifications",
              display: getNotificationDisplay(notifications),
              link: notificationLink,
              position: widget.position,
            }
          case "OverdueTask":
            return {
              id: widget.id,
              title: "Overdue Tasks",
              display: getOverdueTaskDisplay(pastDueTasks),
              link: taskLink,
              position: widget.position,
            }
          case "UpcomingTask":
            return {
              id: widget.id,
              title: "Upcoming Tasks",
              display: getUpcomingTaskDisplay(upcomingTasks),
              link: taskLink,
              position: widget.position,
            }
          default:
            return {
              id: widget.id,
              title: "Unknown Widget",
              display: <div>Widget configuration error</div>,
              link: <div />,
              position: widget.position,
            }
        }
      })
      setBoxes(updatedBoxes)
    }
  }, [fetchedWidgets])

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setBoxes((currentBoxes) => {
        const oldIndex = currentBoxes.findIndex((box) => box.id === active.id)
        const newIndex = currentBoxes.findIndex((box) => box.id === over.id)
        const newBoxes = arrayMove(currentBoxes, oldIndex, newIndex)

        // Update positions based on new order in the state
        const updatedPositions = newBoxes.map((box, index) => ({
          id: box.id,
          position: index + 1,
        }))

        // Call the mutation
        updateWidgetMutation({ positions: updatedPositions })
          .then(() => {
            console.log("Widget positions updated successfully")
          })
          .catch((error) => {
            console.error("Error updating widget positions:", error)
          })

        return newBoxes
      })
    }
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
