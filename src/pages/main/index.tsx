// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Suspense, useEffect } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import getProjects from "src/projects/queries/getProjects"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import getTasks from "src/tasks/queries/getTasks"
import moment from "moment"
import { TaskStatus } from "db"
import getNotifications from "src/messages/queries/getNotifications"
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
import setWidgets from "src/widgets/mutations/setWidgets"
import toast from "react-hot-toast"
import PrimaryButton from "../../core/components/PrimaryButton"
import {
  GetProjectDisplay,
  GetUpcomingTaskDisplay,
  GetOverdueTaskDisplay,
  GetNotificationDisplay,
} from "../../core/components/GetDashboardDisplay"

const MainPage = () => {
  const sidebarItems = HomeSidebarItems("Dashboard")
  const currentUser = useCurrentUser()
  const today = moment().startOf("day")
  const [updateWidgetMutation] = useMutation(updateWidget)
  const [setWidgetMutation] = useMutation(setWidgets)

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
  const [boxes, setBoxes] = useState([])

  const [fetchedWidgets] = useQuery(getUserWidgets, {
    userId: currentUser?.id,
  })

  // then update them on their screen
  useEffect(() => {
    if (fetchedWidgets.length > 0) {
      const sortedWidgets = fetchedWidgets.sort((a, b) => a.position - b.position)
      const updatedBoxes = sortedWidgets.map((widget) => {
        switch (widget.type) {
          case "LastProject":
            return {
              id: widget.id,
              title: "Last Updated Projects",
              display: <GetProjectDisplay projects={projects} />,
              link: <PrimaryButton route={Routes.ProjectsPage()} text="All Projects" />,
              position: widget.position,
              size: "col-span-6",
            }
          case "Notifications":
            return {
              id: widget.id,
              title: "Notifications",
              display: <GetNotificationDisplay notifications={notifications} />,
              link: <PrimaryButton route={Routes.AllTasksPage()} text="All Tasks" />,
              position: widget.position,
              size: "col-span-6",
            }
          case "OverdueTask":
            return {
              id: widget.id,
              title: "Overdue Tasks",
              display: <GetOverdueTaskDisplay pastDueTasks={pastDueTasks} />,
              link: <PrimaryButton route={Routes.NotificationsPage()} text="All Notifications" />,
              position: widget.position,
              size: "col-span-6",
            }
          case "UpcomingTask":
            return {
              id: widget.id,
              title: "Upcoming Tasks",
              display: <GetUpcomingTaskDisplay upcomingTasks={upcomingTasks} />,
              link: <PrimaryButton route={Routes.AllTasksPage()} text="All Tasks" />,
              position: widget.position,
              size: "col-span-6",
            }
          default:
            return {
              id: widget.id,
              title: "Unknown Widget",
              display: <div>Widget configuration error</div>,
              link: <div />,
              position: widget.position,
              size: "col-span-6",
            }
        }
      })
      setBoxes(updatedBoxes)
    } else {
      console.log("no widgets")
      // Call the mutation
      setWidgetMutation({ id: currentUser?.id })
        .then(() => {
          //console.log("Widget positions updated successfully")
          toast.success(`Added dashboard, please refresh!`)
        })
        .catch((error) => {
          //console.error("Error updating widget positions:", error)
          toast.error(`Issue with dashboard, please contact help.`)
        })
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
            //console.log("Widget positions updated successfully")
          })
          .catch((error) => {
            //console.error("Error updating widget positions:", error)
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
