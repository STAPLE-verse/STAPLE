import Table from "src/core/components/Table"
import {
  tasksColumns,
  projectColumns,
  notificationColumns,
  projectTaskColumns,
  projectManagersColumns,
} from "src/widgets/components/ColumnHelpers"
import { UserIcon, GlobeAltIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import DateFormat from "./DateFormat"

export function GetProjectDisplay({ projects }) {
  if (projects.length === 0) {
    return <p className="italic p-2">No projects</p>
  }
  return (
    <Table
      columns={projectColumns}
      data={projects}
      classNames={{
        thead: "text-sm text-base-content",
        tbody: "text-sm text-base-content",
        td: "text-sm text-base-content",
      }}
    />
  )
}

export function GetUpcomingTaskDisplay({ upcomingTasks }) {
  if (upcomingTasks.length === 0) {
    return <p className="italic p-2">No upcoming tasks</p>
  }

  return (
    <Table
      columns={tasksColumns}
      data={upcomingTasks}
      classNames={{
        thead: "text-sm text-base-content",
        tbody: "text-sm text-base-content",
        td: "text-sm text-base-content",
      }}
    />
  )
}

export function GetOverdueTaskDisplay({ pastDueTasks }) {
  if (pastDueTasks.length === 0) {
    return <p className="italic p-2">No overdue tasks</p>
  }

  return (
    <Table
      columns={tasksColumns}
      data={pastDueTasks}
      classNames={{
        thead: "text-sm text-base-content",
        tbody: "text-sm text-base-content",
        td: "text-sm text-base-content",
      }}
    />
  )
}

export function GetNotificationDisplay({ notifications }) {
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

export function GetProjectSummaryDisplay({ project, projectManagers }) {
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

export function GetProjectUpcomingTaskDisplay({ upcomingTasks }) {
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

export function GetProjectOverdueTaskDisplay({ pastDueTasks }) {
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

export function GetProjectMemberDisplay({ projectStats }) {
  return (
    <div className="flex flex-grow justify-center items-center font-bold text-3xl size-circle">
      {projectStats.allProjectMember}
      <UserIcon className="w-20" />
    </div>
  )
}

export function GetTeamDisplay({ projectStats }) {
  return (
    <div className="flex flex-grow justify-center items-center font-bold text-3xl size-circle">
      {projectStats.allTeams}
      <GlobeAltIcon className="w-20" />
    </div>
  )
}

export function GetFormDisplay({ formPercent }) {
  return (
    <div className="flex flex-grow justify-center items-center font-bold text-3xl size-circle">
      <CircularProgressbar
        value={formPercent * 100}
        text={`${Math.round(formPercent * 100)}%`}
        styles={buildStyles({
          textSize: "16px",
          pathTransitionDuration: 0,
          pathColor: "oklch(var(--p))",
          textColor: "oklch(var(--s))",
          trailColor: "oklch(var(--pc))",
          backgroundColor: "oklch(var(--b3))",
        })}
      />
    </div>
  )
}

export function GetTotalTaskDisplay({ taskPercent }) {
  return (
    <div className="flex flex-grow justify-center items-center font-bold text-3xl size-circle">
      <CircularProgressbar
        value={taskPercent * 100}
        text={`${Math.round(taskPercent * 100)}%`}
        styles={buildStyles({
          textSize: "16px",
          pathTransitionDuration: 0,
          pathColor: "oklch(var(--p))",
          textColor: "oklch(var(--s))",
          trailColor: "oklch(var(--pc))",
          backgroundColor: "oklch(var(--b3))",
        })}
      />
    </div>
  )
}

export function GetElementDisplay({ projectStats }) {
  return (
    <div className="flex flex-grow justify-center items-center font-bold text-3xl size-circle">
      {projectStats.allElements}
      <ArchiveBoxIcon className="w-20" />
    </div>
  )
}

export function GetRolesDisplay({ rolePercent }) {
  return (
    <div className="flex flex-grow justify-center items-center font-bold text-3xl size-circle">
      <CircularProgressbar
        value={rolePercent * 100}
        text={`${Math.round(rolePercent * 100)}%`}
        styles={buildStyles({
          textSize: "16px",
          pathTransitionDuration: 0,
          pathColor: "oklch(var(--p))",
          textColor: "oklch(var(--s))",
          trailColor: "oklch(var(--pc))",
          backgroundColor: "oklch(var(--b3))",
        })}
      />
    </div>
  )
}
