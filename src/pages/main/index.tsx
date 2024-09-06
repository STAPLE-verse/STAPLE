import { Suspense, useEffect, useState } from "react"
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

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl h-full space-y-4">
      <div className="mb-4 justify-center flex">
        <h3 className="text-3xl">Welcome, {currentUser!.username}!</h3>
      </div>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
        <WidgetContainer widgets={constructedWidgets} />
      </DndContext>
    </main>
  )
}

export const MainPage = () => (
  <Layout>
    <Head>
      <title>Home</title>
    </Head>
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent />
    </Suspense>
  </Layout>
)

MainPage.authenticate = true

export default MainPage
