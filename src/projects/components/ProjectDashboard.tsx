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
import getProjects from "src/projects/queries/getProjects" // remove
import getProject from "src/projects/queries/getProject"
import getNotifications from "src/messages/queries/getNotifications"
import {
  tasksColumns,
  projectColumns,
  notificationColumns,
  projectManagersColumns,
  projectTaskColumns,
} from "src/widgets/components/ColumnHelpers"

const ProjectDashboard = () => {
  //default information
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()
  const today = moment().startOf("minute")
  const [currentContributor] = useQuery(getContributor, {
    where: { userId: currentUser!.id, projectId: projectId },
  })
  const [project] = useQuery(getProject, { id: projectId }) // updated

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
  const [fetchedWidgets] = useQuery(getProjectWidgets, {
    userId: currentUser?.id,
    projectId: projectId,
  })

  // mutations for the widgets
  const [updateWidgetMutation] = useMutation(updateProjectWidgets)
  const [setWidgetMutation] = useMutation(setProjectWidgets)

  // links
  const projectLink = (
    <Link
      className="btn btn-primary self-end m-4"
      href={Routes.EditProjectPage({ projectId: projectId! })}
    >
      Edit Project
    </Link>
  ) // updated
  const taskLink = (
    <Link className="btn btn-primary self-end m-4" href={Routes.AllTasksPage()}>
      All Tasks
    </Link>
  )
  const notificationLink = (
    <Link
      className="btn btn-primary self-end m-4"
      href={Routes.ProjectNotificationsPage({ projectId: projectId! })}
    >
      All Notifications
    </Link>
  )

  // displays
  const getProjectDisplay = (project) => {
    return (
      <div>
        {project.description}
        <p className="italic">
          Last update:{" "}
          {project.updatedAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // Use 24-hour format
          })}
        </p>

        <p className="font-bold mt-4">Contacts for the Project: </p>
        <Table
          columns={projectManagersColumns}
          data={projectManagers}
          classNames={{
            thead: "text-sm",
            tbody: "text-sm",
            td: "text-sm",
          }}
        />
      </div>
    )
  }
  const getUpcomingTaskDisplay = (upcomingTasks) => {
    if (upcomingTasks.length === 0) {
      return <p className="italic p-2">No upcoming tasks</p>
    }

    return (
      <Table
        columns={projectTaskColumns}
        data={upcomingTasks}
        classNames={{
          thead: "text-sm text-base-content",
          tbody: "text-sm text-base-content",
          td: "text-sm text-base-content",
        }}
      />
    )
  }
  const getOverdueTaskDisplay = (pastDueTasks) => {
    if (pastDueTasks.length === 0) {
      return <p className="italic p-2">No overdue tasks</p>
    }

    return (
      <Table
        columns={projectTaskColumns}
        data={pastDueTasks}
        classNames={{
          thead: "text-sm text-base-content",
          tbody: "text-sm text-base-content",
          td: "text-sm text-base-content",
        }}
      />
    )
  }
  const getNotificationDisplay = (notifications) => {
    if (notifications.length === 0) {
      return <p className="italic p-2">No unread notifications</p>
    }

    return (
      <Table
        columns={notificationColumns}
        data={notifications}
        classNames={{
          thead: "text-sm text-base-content",
          tbody: "text-sm text-base-content",
          td: "text-sm text-base-content",
        }}
      />
    )
  }

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
      recipients: {
        some: {
          id: currentUser!.id,
        },
      },
      read: false,
    },
    orderBy: { id: "desc" },
    take: 3,
  })

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
          case "ProjectSummary":
            return {
              id: widget.id,
              title: project.name,
              display: getProjectDisplay(project),
              link: projectLink,
              position: widget.position,
              size: "col-span-8",
            }
          case "Notifications":
            return {
              id: widget.id,
              title: "Notifications",
              display: getNotificationDisplay(notifications),
              link: notificationLink,
              position: widget.position,
              size: "col-span-4",
            }
          case "OverdueTask":
            return {
              id: widget.id,
              title: "Overdue Tasks",
              display: getOverdueTaskDisplay(pastDueTasks),
              link: taskLink,
              position: widget.position,
              size: "col-span-6",
            }
          case "UpcomingTask":
            return {
              id: widget.id,
              title: "Upcoming Tasks",
              display: getUpcomingTaskDisplay(upcomingTasks),
              link: taskLink,
              position: widget.position,
              size: "col-span-4",
            }
          case "ContributorNumber":
            return {
              id: widget.id,
              title: "Contributors",
              display: getUpcomingTaskDisplay(upcomingTasks),
              link: taskLink,
              position: widget.position,
              size: "col-span-4",
            }
          case "TeamNumber":
            return {
              id: widget.id,
              title: "Teams",
              display: getUpcomingTaskDisplay(upcomingTasks),
              link: taskLink,
              position: widget.position,
              size: "col-span-4",
            }
          case "FormNumber":
            return {
              id: widget.id,
              title: "Forms",
              display: getUpcomingTaskDisplay(upcomingTasks),
              link: taskLink,
              position: widget.position,
              size: "col-span-4",
            }
          case "TaskTotal":
            return {
              id: widget.id,
              title: "Tasks",
              display: getUpcomingTaskDisplay(upcomingTasks),
              link: taskLink,
              position: widget.position,
            }
          case "ElementSummary":
            return {
              id: widget.id,
              title: "Elements",
              display: getUpcomingTaskDisplay(upcomingTasks),
              link: taskLink,
              position: widget.position,
              size: "col-span-4",
            }
          case "LabelsSummary":
            return {
              id: widget.id,
              title: "Labels",
              display: getUpcomingTaskDisplay(upcomingTasks),
              link: taskLink,
              position: widget.position,
              size: "col-span-4",
            }
          default:
            return {
              id: widget.id,
              title: "Unknown Widget",
              display: <div>Widget configuration error</div>,
              link: <div />,
              position: widget.position,
              size: "col-span-4",
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
