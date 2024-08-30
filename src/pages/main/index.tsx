import { Suspense } from "react"
import Head from "next/head"
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
import { SortableBox } from "src/core/components/SortableBox"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import useDashboardDragHandlers from "src/widgets/hooks/useDashboardDragHandlers"
import useMainDashboardData from "src/widgets/hooks/useMainDashboardData"
import { useMutation, useQuery } from "@blitzjs/rpc"
import updateWidget from "src/widgets/mutations/updateWidget"
import getUserWidgets from "src/widgets/queries/getUserWidgets"
import useWidgetConstruction from "src/widgets/hooks/useConstructWidgets"

const MainPage = () => {
  const [updateWidgetMutation] = useMutation(updateWidget)

  const currentUser = useCurrentUser()

  const dashboardData = useMainDashboardData()

  const [widgets] = useQuery(getUserWidgets, { userId: currentUser?.id! })

  const { boxes, setBoxes } = useWidgetConstruction({
    userId: currentUser?.id!,
    widgets,
    additionalData: dashboardData,
  })

  const { handleDragEnd } = useDashboardDragHandlers({
    setBoxes,
    updateWidgetMutation,
  })

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
