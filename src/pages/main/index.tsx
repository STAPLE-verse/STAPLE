// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Suspense, useEffect } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
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
import PrimaryLink from "../../core/components/PrimaryLink"
import {
  GetProjectDisplay,
  GetUpcomingTaskDisplay,
  GetOverdueTaskDisplay,
  GetNotificationDisplay,
} from "../../core/components/GetDashboardDisplay"
import getDashboardTasks from "../../tasks/queries/getDashboardTasks"
import getDashboardProjects from "src/projects/queries/getDashboardProjects"
import getDashboardNotifications from "src/notifications/queries/getDashboardNotifications"
import { NotificationProvider } from "src/notifications/components/NotificationContext"

const MainPage = () => {
  const currentUser = useCurrentUser()
  const [updateWidgetMutation] = useMutation(updateWidget)
  const [setWidgetMutation] = useMutation(setWidgets)
  const [{ upcomingTasks, pastDueTasks }] = useQuery(getDashboardTasks, undefined)
  const [{ projects }] = useQuery(getDashboardProjects, undefined)
  const [{ notifications }] = useQuery(getDashboardNotifications, undefined)

  // Get the widgets for the user
  const [boxes, setBoxes] = useState([])

  const [fetchedWidgets] = useQuery(getUserWidgets, {
    userId: currentUser?.id,
  })

  // then update them on their screen
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              link: <PrimaryLink route={Routes.ProjectsPage()} text="All Projects" />,
              position: widget.position,
              size: "col-span-6",
              tooltipId: "tool-last-project",
              tooltipContent: "Three recently updated projects",
            }
          case "Notifications":
            return {
              id: widget.id,
              title: "Notifications",
              display: <GetNotificationDisplay notifications={notifications} />,
              link: <PrimaryLink route={Routes.NotificationsPage()} text="All Tasks" />,
              position: widget.position,
              size: "col-span-6",
              tooltipId: "tool-notifications",
              tooltipContent: "Three recent notifications for all projects",
            }
          case "OverdueTask":
            return {
              id: widget.id,
              title: "Overdue Tasks",
              display: <GetOverdueTaskDisplay pastDueTasks={pastDueTasks} />,
              link: <PrimaryLink route={Routes.AllTasksPage()} text="All Notifications" />,
              position: widget.position,
              size: "col-span-6",
              tooltipId: "tool-overdue",
              tooltipContent: "Three overdue tasks for all projects",
            }
          case "UpcomingTask":
            return {
              id: widget.id,
              title: "Upcoming Tasks",
              display: <GetUpcomingTaskDisplay upcomingTasks={upcomingTasks} />,
              link: <PrimaryLink route={Routes.AllTasksPage()} text="All Tasks" />,
              position: widget.position,
              size: "col-span-6",
              tooltipId: "tool-upcoming",
              tooltipContent: "Three upcoming tasks for all projects",
            }
          default:
            return {
              id: widget.id,
              title: "Unknown Widget",
              display: <div>Widget configuration error</div>,
              link: <div />,
              position: widget.position,
              size: "col-span-6",
              tooltipId: "tool-unknown",
              tooltipContent: "Unknown widget",
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      })
      setBoxes(updatedBoxes)
    } else {
      // console.log("no widgets")
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <Layout>
      <Head>
        <title>Home</title>
      </Head>

      <Suspense fallback={<div>Loading...</div>}>
        <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl h-full space-y-4">
          <div className="mb-4 justify-center flex">
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
