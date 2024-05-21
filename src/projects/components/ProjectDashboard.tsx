// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// react tanstack error

import { useEffect } from "react"
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
import toast from "react-hot-toast"

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

  // mutations for the widgets
  const [updateWidgetMutation] = useMutation(updateProjectWidgets)
  const [setWidgetMutation] = useMutation(setProjectWidgets)

  // if the length is 0, then create widgets
  useEffect(() => {
    if (fetchedWidgets.length === 0) {
      //console.log("no widgets")
      var setUpProjectDashboard = setWidgetMutation({
        userId: currentUser?.id,
        projectId: projectId,
      })
        .then(() => {
          //console.log("Widget positions updated successfully")
          toast.success(`Added dashboard, please refresh!`)
        })
        .catch((error) => {
          //console.error("Error updating widget positions:", error)
          toast.error(`Issue with dashboard, please contact help.`)
        })
    } else {
      // else start dealing with widgets
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

  return (
    <div className="flex flex-col space-y-4">
      <DndContext collisionDectection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableBox boxes={boxes} />
      </DndContext>
    </div>
  )
}

export default ProjectDashboard
