import { Suspense, useEffect, useState } from "react"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import React from "react"
import {
  DndContext,
  KeyboardSensor,
  TouchSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import useDashboardDragHandlers from "src/widgets/hooks/useDashboardDragHandlers"
import { useMutation, useQuery } from "@blitzjs/rpc"
import updateWidget from "src/widgets/mutations/updateWidget"
import { useWidgetConstruction } from "src/widgets/hooks/useWidgetConstruction"
import { WidgetContainer } from "src/widgets/components/WidgetContainer"
import { Widget } from "db"
import getUserWidgets from "src/widgets/queries/getUserWidgets"
import initializeWidgets from "src/widgets/mutations/initializeWidgets"
import toast from "react-hot-toast"
import { Tooltip } from "react-tooltip"
import { InformationCircleIcon } from "@heroicons/react/24/outline"

const MainContent = () => {
  const [updateWidgetMutation] = useMutation(updateWidget)
  const [initializeWidgetsMutation] = useMutation(initializeWidgets)

  const currentUser = useCurrentUser()
  const userId = currentUser?.id!

  const [widgets, setWidgets] = useState<Widget[]>([])

  const [fetchedWidgets] = useQuery(getUserWidgets, { userId })

  useEffect(() => {
    if (fetchedWidgets.length > 0) {
      setWidgets(fetchedWidgets)
    } else {
      initializeWidgetsMutation(userId)
        .then((createdWidgets) => {
          setWidgets(createdWidgets)
          toast.success(`Dashboard added successfully!`)
        })
        .catch(() => {
          toast.error(`Issue with dashboard, please contact help.`)
        })
    }
  }, [fetchedWidgets, initializeWidgetsMutation, userId])

  const constructedWidgets = useWidgetConstruction({ widgets, registryType: "main" })
  const { handleDragEnd } = useDashboardDragHandlers({ setWidgets, updateWidgetMutation })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const name = currentUser!.firstName
    ? `${currentUser?.firstName} ${currentUser?.lastName}`
    : currentUser!.username

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl h-full space-y-4">
      <h3 className="text-3xl justify-center items-center flex">
        Welcome, {name}!
        <InformationCircleIcon
          className="h-6 w-6 ml-2 text-info stroke-2"
          data-tooltip-id="dashboard-overview"
        />
        <Tooltip
          id="dashboard-overview"
          content="Welcome to the main dahsboard! You can rearrange these widgets by clicking and dragging the boxes. Use the buttons to navigate to tasks, notifications, and more. "
          className="z-[1099] ourtooltips"
        />
      </h3>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
        <WidgetContainer widgets={constructedWidgets} />
      </DndContext>
    </main>
  )
}

export const MainPage = () => (
  <Layout title="Home">
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent />
    </Suspense>
  </Layout>
)

MainPage.authenticate = true

export default MainPage
