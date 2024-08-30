import { useEffect } from "react"
import { useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { TaskStatus } from "db"
import moment from "moment"
import getTasks from "src/tasks/queries/getTasks"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getProjectStats from "../queries/getProjectStats"
import getContributors from "src/contributors/queries/getContributors"
import "react-circular-progressbar/dist/styles.css"
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
import getProject from "src/projects/queries/getProject"
import getNotifications from "src/notifications/queries/getNotifications"
import useDashboardDragHandlers from "src/widgets/hooks/useDashboardDragHandlers"

const ProjectDashboard = () => {
  const [updateWidgetMutation] = useMutation(updateProjectWidgets)

  const currentUser = useCurrentUser()

  const { handleDragEnd } = useDashboardDragHandlers({
    setBoxes,
    updateWidgetMutation,
  })

  const today = moment().startOf("minute")
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })

  // Get the widgets for the user
  const [boxes, setBoxes] = useState([])
  const [fetchedWidgets] = useQuery(getProjectWidgets, {
    userId: currentUser?.id,
    projectId: projectId,
  })

  // mutations for the widgets

  const [setWidgetMutation] = useMutation(setProjectWidgets)

  //get the data
  // get the project manangers
  const [{ contributors: projectManagers }] = useQuery(getContributors, {
    where: {
      projectId: projectId,
      privilege: "PROJECT_MANAGER",
    },
    include: {
      user: true,
    },
  })
  // get all tasks
  const [{ tasks }] = useQuery(getTasks, {
    include: {
      project: { select: { name: true } },
    },
    where: {
      assignees: { some: { contributor: { user: { id: currentUser?.id } } } },
      status: TaskStatus.NOT_COMPLETED,
      projectId: projectId,
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
  // get no deadline
  const noDeadlineTasks = tasks.filter((task) => {
    if (task && task.deadline === null) {
      return moment(task.deadline)
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
  // get all notifications
  const [{ notifications }] = useQuery(getNotifications, {
    where: {
      recipients: { some: { id: currentUser!.id } },
      projectId: projectId,
      read: false,
    },
    orderBy: { id: "desc" },
    take: 3,
  })
  // get project stats
  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  // deal with zeroes
  var formPercent
  if (projectStats.allAssignments == 0) {
    formPercent = 0
  } else {
    formPercent = projectStats.completedAssignments / projectStats.allAssignments
  }
  // deal with zeroes
  var taskPercent
  if (projectStats.allTask == 0) {
    taskPercent = 0
  } else {
    taskPercent = projectStats.completedTask / projectStats.allTask
  }
  // this one ok because never zeroes out
  const labelPercent =
    (projectStats.completedContribLabels + projectStats.completedTaskLabels) /
    (projectStats.allContributor + projectStats.allTask)

  // if the length is 0, then create widgets
  useEffect(() => {
    if (fetchedWidgets.length === 0) {
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
        }
      })
      setBoxes(updatedBoxes)
    }
  }, [fetchedWidgets])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <div className="flex flex-col space-y-4">
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableBox boxes={boxes} />
      </DndContext>
    </div>
  )
}

export default ProjectDashboard
