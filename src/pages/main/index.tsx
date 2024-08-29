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
import useMainDashboardDragHandlers from "src/widgets/hooks/useMainDashboardDragHandlers"
import useMainDashboardData from "src/widgets/hooks/useMainDashboardData"

const MainPage = () => {
  const currentUser = useCurrentUser()

  const { boxes, setBoxes } = useMainDashboardData(currentUser?.id!)
  const { handleDragEnd } = useMainDashboardDragHandlers({ setBoxes })

  // DND Handlers
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
