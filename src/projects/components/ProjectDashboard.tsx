// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// react tanstack error

import { useEffect } from "react"
import { Routes, useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { TaskStatus } from "db"
import moment from "moment"
import Link from "next/link"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getProjectStats from "../queries/getProjectStats"
import getContributors from "src/contributors/queries/getContributors"
import { UserIcon, GlobeAltIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

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
import getProject from "src/projects/queries/getProject"
import getNotifications from "src/notifications/queries/getNotifications"
import {
  notificationColumns,
  projectManagersColumns,
  projectTaskColumns,
} from "src/widgets/components/ColumnHelpers"
import DateFormat from "src/core/components/DateFormat"

const ProjectDashboard = () => {
  //default information
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()
  const today = moment().startOf("minute")
  const [project] = useQuery(getProject, { id: projectId })

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
  )
  const taskLink = (
    <Link
      className="btn btn-primary self-end m-4"
      href={Routes.TasksPage({
        projectId: projectId,
      })}
    >
      All Tasks
    </Link>
  )
  const notificationLink = (
    <Link
      className="btn btn-primary self-end m-4"
      href={Routes.ProjectNotificationsPage({ projectId: projectId! })}
    >
      Project Notifications
    </Link>
  )
  const contributorLink = (
    <Link
      className="btn btn-primary self-end m-4"
      href={Routes.ContributorsPage({ projectId: projectId! })}
    >
      View
    </Link>
  )
  const teamLink = (
    <Link
      className="btn btn-primary self-end m-4"
      href={Routes.TeamsPage({ projectId: projectId! })}
    >
      View
    </Link>
  )
  const formLink = (
    <Link
      className="btn btn-primary self-end m-4"
      href={Routes.MetadataPage({ projectId: projectId! })}
    >
      View
    </Link>
  )
  const elementLink = (
    <Link
      className="btn btn-primary self-end m-4"
      href={Routes.ElementsPage({ projectId: projectId! })}
    >
      View
    </Link>
  )
  const labelLink = (
    <Link
      className="btn btn-primary self-end m-4"
      href={Routes.CreditPage({ projectId: projectId! })}
    >
      View
    </Link>
  )
  const taskSummaryLink = (
    <Link
      className="btn btn-primary self-end m-4"
      href={Routes.TasksPage({
        projectId: projectId,
      })}
    >
      View
    </Link>
  )

  // displays
  const getProjectDisplay = (project) => {
    return (
      <div>
        {project.description}
        <p className="italic">
          Last update: <DateFormat date={project.updatedAt}></DateFormat>
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
        data={upcomingTasks.slice(0, 3)}
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
        data={pastDueTasks.slice(0, 3)}
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
  const getContributorDisplay = (projectStats) => {
    return (
      <div className="flex justify-center font-bold text-3xl">
        {projectStats.allContributor}
        <UserIcon className="w-20" />
      </div>
    )
  }
  const getTeamDisplay = (projectStats) => {
    return (
      <div className="flex justify-center font-bold text-3xl">
        {projectStats.allTeams}
        <GlobeAltIcon className="w-20" />
      </div>
    )
  }
  const getFormDisplay = (projectStats) => {
    return (
      <div className="flex justify-center font-bold text-3xl">
        <CircularProgressbar
          value={formPercent * 100}
          text={`${Math.round(formPercent * 100)}%`}
          styles={buildStyles({
            textSize: "16px",
            pathTransitionDuration: "none",
            pathColor: "oklch(var(--p))",
            textColor: "oklch(var(--s))",
            trailColor: "oklch(var(--pc))",
            backgroundColor: "oklch(var(--b3))",
          })}
        />
      </div>
    )
  }
  const getTotalTaskDisplay = (projectStats) => {
    return (
      <div className="flex justify-center font-bold text-3xl">
        <CircularProgressbar
          value={taskPercent * 100}
          text={`${Math.round(taskPercent * 100)}%`}
          styles={buildStyles({
            textSize: "16px",
            pathTransitionDuration: "none",
            pathColor: "oklch(var(--p))",
            textColor: "oklch(var(--s))",
            trailColor: "oklch(var(--pc))",
            backgroundColor: "oklch(var(--b3))",
          })}
        />
      </div>
    )
  }
  const getElementDisplay = (projectStats) => {
    return (
      <div className="flex justify-center font-bold text-3xl">
        {projectStats.allElements}
        <ArchiveBoxIcon className="w-20" />
      </div>
    )
  }
  const getLabelsDisplay = (projectStats) => {
    return (
      <div className="flex justify-center font-bold text-3xl">
        <CircularProgressbar
          value={labelPercent * 100}
          text={`${Math.round(labelPercent * 100)}%`}
          styles={buildStyles({
            textSize: "16px",
            pathTransitionDuration: "none",
            pathColor: "oklch(var(--p))",
            textColor: "oklch(var(--s))",
            trailColor: "oklch(var(--pc))",
            backgroundColor: "oklch(var(--b3))",
          })}
        />
      </div>
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
  //console.log(projectStats.contribLabels)
  //console.log(projectStats.completedContribLabels)

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
              size: "col-span-6",
              tooltipId: "tool-project",
              tooltipContent: "Overall project information",
            }
          case "Notifications":
            return {
              id: widget.id,
              title: "Notifications",
              display: getNotificationDisplay(notifications),
              link: notificationLink,
              position: widget.position,
              size: "col-span-6",
              tooltipId: "tool-notification",
              tooltipContent: "Three notifications for this project",
            }
          case "OverdueTask":
            return {
              id: widget.id,
              title: "Overdue Tasks",
              display: getOverdueTaskDisplay(pastDueTasks),
              link: taskLink,
              position: widget.position,
              size: "col-span-6",
              tooltipId: "tool-overdue",
              tooltipContent: "Three overdue tasks for this project",
            }
          case "UpcomingTask":
            return {
              id: widget.id,
              title: "Upcoming Tasks",
              display: getUpcomingTaskDisplay(upcomingTasks),
              link: taskLink,
              position: widget.position,
              size: "col-span-6",
              tooltipId: "tool-upcoming",
              tooltipContent: "Three upcoming tasks for this project",
            }
          case "ContributorNumber":
            return {
              id: widget.id,
              title: "Contributors",
              display: getContributorDisplay(projectStats),
              link: contributorLink,
              position: widget.position,
              size: "col-span-2",
              tooltipId: "tool-contributors",
              tooltipContent: "Total number of contributors",
            }
          case "TeamNumber":
            return {
              id: widget.id,
              title: "Teams",
              display: getTeamDisplay(projectStats),
              link: teamLink,
              position: widget.position,
              size: "col-span-2",
              tooltipId: "tool-teams",
              tooltipContent: "Total number of teams",
            }
          case "FormNumber":
            return {
              id: widget.id,
              title: "Forms",
              display: getFormDisplay(projectStats),
              link: formLink,
              position: widget.position,
              size: "col-span-2",
              tooltipId: "tool-forms",
              tooltipContent: "Percent of forms completed",
            }
          case "TaskTotal":
            return {
              id: widget.id,
              title: "Tasks",
              display: getTotalTaskDisplay(projectStats),
              link: taskSummaryLink,
              position: widget.position,
              size: "col-span-2",
              tooltipId: "tool-tasks",
              tooltipContent: "Percent of tasks completed",
            }
          case "ElementSummary":
            return {
              id: widget.id,
              title: "Elements",
              display: getElementDisplay(projectStats),
              link: elementLink,
              position: widget.position,
              size: "col-span-2",
              tooltipId: "tool-element",
              tooltipContent: "Number of elements for this project",
            }
          case "LabelsSummary":
            return {
              id: widget.id,
              title: "Roles",
              display: getLabelsDisplay(projectStats),
              link: labelLink,
              position: widget.position,
              size: "col-span-2",
              tooltipId: "tool-labels",
              tooltipContent: "Percent of contributors or tasks labeled",
            }
          default:
            return {
              id: widget.id,
              title: "Unknown Widget",
              display: <div>Widget configuration error</div>,
              link: <div />,
              position: widget.position,
              size: "col-span-4",
              tooltipId: "tool-unknown",
              tooltipContent: "Unknown widget",
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
