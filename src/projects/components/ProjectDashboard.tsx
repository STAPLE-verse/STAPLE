// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// react tanstack error

import { Routes, useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { Contributor, ContributorPrivileges, Prisma, Task, TaskStatus, User, Assignment } from "db"
import moment from "moment"
import Link from "next/link"
import getContributor from "src/contributors/queries/getContributor"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getProjectStats from "../queries/getProjectStats"
import getContributors from "src/contributors/queries/getContributors"
import { HeartIcon } from "@heroicons/react/24/outline"
import getProlificContributors from "src/contributors/queries/getProlificContributors"

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
import updateProjectWidgets from "src/widgets/mutations/updateProjectWidgets"
import setProjectWidgets from "src/widgets/mutations/setProjectWidgets"
import getProjectWidgets from "src/widgets/queries/getProjectWidgets"

const ProjectDashboard = () => {
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()
  const [currentContributor] = useQuery(getContributor, {
    where: { userId: currentUser!.id, projectId: projectId },
  })

  // dragging information
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

  // Get the widgets for the user
  const [boxes, setBoxes] = useState([])
  // console.log(currentUser.id, projectId)
  const [fetchedWidgets] = useQuery(getProjectWidgets, {
    userId: currentUser?.id,
    projectId: projectId,
  })

  // if the length is 0, then create widgets

  // else grab the widgets

  console.log(fetchedWidgets.length)

  // mutations for the widgets
  const [updateWidgetMutation] = useMutation(updateProjectWidgets)
  const [setWidgetMutation] = useMutation(setProjectWidgets)

  return (
    <div className="flex flex-col space-y-4">
      <DndContext collisionDectection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableBox boxes={boxes} />
      </DndContext>
    </div>
  )
}

export default ProjectDashboard
