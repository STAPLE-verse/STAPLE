// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Suspense, useEffect } from "react"
import Head from "next/head"
import { useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"

import LastProject from "src/widgets/components/LastProject"
import Notifications from "src/widgets/components/Notifications"
import OverdueTask from "src/widgets/components/OverdueTask"
import UpcomingTask from "src/widgets/components/UpcomingTask"

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

const componentMap = {
  LastProject: LastProject,
  Notifications: Notifications,
  UpcomingTask: UpcomingTask,
  OverdueTask: OverdueTask,
}

const MainPage = () => {
  const sidebarItems = HomeSidebarItems("Dashboard")
  const currentUser = useCurrentUser()

  // Get the widgets for the user
  const [fetchedWidgets] = useQuery(getUserWidgets, {
    userId: currentUser?.id,
  })

  const [widgets, setWidgets] = useState([])

  useEffect(() => {
    if (fetchedWidgets) {
      // Assign user data to each widget
      const preparedWidgets = fetchedWidgets.map((widget) => ({
        ...widget,
        props: { currentUser: currentUser },
      }))
      setWidgets(preparedWidgets)
    }
  }, [fetchedWidgets, currentUser])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setWidgets((currentWidgets) => {
        const oldIndex = currentWidgets.findIndex((box) => box.id === active.id)
        const newIndex = currentWidgets.findIndex((box) => box.id === over.id)
        return arrayMove(currentWidgets, oldIndex, newIndex)
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
            <SortableBox
              widgets={widgets.map((widget) => ({
                id: widget.id,
                Component: componentMap[widget.type],
                props: widget.props,
              }))}
            />
          </DndContext>
        </main>
      </Suspense>
    </Layout>
  )
}

export default MainPage
