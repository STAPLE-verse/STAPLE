import { Suspense, useEffect } from "react"
import Head from "next/head"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getUserWidgets from "src/widgets/queries/getUserWidgets"
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
import getDashboardTasks from "../../tasks/queries/getDashboardTasks"
import getDashboardProjects from "src/projects/queries/getDashboardProjects"
import getLatestUnreadNotifications from "src/notifications/queries/getLatestUnreadNotifications"
import { WidgetObject, constructWidget } from "src/widgets/utils/constructWidget"

const MainPage = () => {
  // Setup
  const [updateWidgetMutation] = useMutation(updateWidget)
  const [setWidgetMutation] = useMutation(setWidgets)

  const [boxes, setBoxes] = useState<WidgetObject[]>([])

  // Get data
  // User data
  const currentUser = useCurrentUser()
  //Widget content
  const [{ upcomingTasks, pastDueTasks }] = useQuery(getDashboardTasks, undefined)
  const [{ projects }] = useQuery(getDashboardProjects, undefined)
  const [{ notifications }] = useQuery(getLatestUnreadNotifications, {})
  // Widgets for the user
  const [fetchedWidgets] = useQuery(getUserWidgets, {
    userId: currentUser?.id,
  })

  // Construct widgets based on user data
  useEffect(() => {
    if (fetchedWidgets.length > 0) {
      const sortedWidgets = fetchedWidgets.sort((a, b) => a.position - b.position)
      const updatedBoxes = sortedWidgets.map((widget) => {
        return constructWidget({ widget, projects, notifications, pastDueTasks, upcomingTasks })
      })
      setBoxes(updatedBoxes)
    } else {
      // Call the mutation
      setWidgetMutation({ id: currentUser?.id })
        .then(() => {
          toast.success(`Added dashboard, please refresh!`)
        })
        .catch(() => {
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
          .then(() => {})
          .catch((error) => {})

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
            collisionDetection={closestCorners}
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
