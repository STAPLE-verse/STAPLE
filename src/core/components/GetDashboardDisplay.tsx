import Table from "src/core/components/Table"
import {
  tasksColumns,
  projectColumns,
  notificationColumns,
} from "src/widgets/components/ColumnHelpers"

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
