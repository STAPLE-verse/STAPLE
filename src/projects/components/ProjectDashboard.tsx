import { Routes, useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ContributorRole, Task } from "db"
import moment from "moment"
import Link from "next/link"
import getContributor from "src/contributors/queries/getContributor"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getProjectStats from "../queries/getProjectStats"
import getContributors from "src/contributors/queries/getContributors"
import { HeartIcon } from "@heroicons/react/24/outline"

const ProjectDashboard = () => {
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })

  const taskColumnHelper = createColumnHelper<Task>()

  // ColumnDefs
  const tasksColumns: ColumnDef<Task>[] = [
    taskColumnHelper.accessor("name", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Name",
    }),
    taskColumnHelper.accessor("deadline", {
      cell: (info) => (
        <span>
          {" "}
          {info.getValue()
            ? info.getValue()?.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false, // Use 24-hour format
              })
            : "No Deadline"}
        </span>
      ),
      header: "Deadline",
    }),
    taskColumnHelper.accessor("id", {
      id: "view",
      header: "",
      cell: (info) => (
        <Link
          className="btn"
          href={Routes.ShowTaskPage({
            projectId: info.row.original.projectId,
            taskId: info.getValue(),
          })}
        >
          Open
        </Link>
      ),
    }),
  ]

  const pastDueTasksColumns: ColumnDef<Task>[] = [
    taskColumnHelper.accessor("name", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Name",
    }),
    taskColumnHelper.accessor("deadline", {
      cell: (info) => (
        <span>
          {" "}
          {info.getValue()
            ? info.getValue()?.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false, // Use 24-hour format
              })
            : "No Deadline"}
        </span>
      ),
      header: "Deadline",
    }),
    // TODO: Change this if completed tasks are added
    taskColumnHelper.accessor("id", {
      id: "view",
      header: "",
      cell: (info) => (
        <Link
          className="btn"
          href={Routes.ShowTaskPage({
            projectId: info.row.original.projectId,
            taskId: info.getValue(),
          })}
        >
          Ping contributors
        </Link>
      ),
    }),
  ]

  const today = moment().startOf("day")
  const tomorrow = moment(today).add(1, "days")

  const [{ tasks }] = useQuery(getTasks, {
    where: {
      project: { id: projectId },
      deadline: {
        gte: today.toDate(),
        lt: moment(tomorrow).add(1, "days").toDate(),
      },
    },
    orderBy: { id: "asc" },
  })

  const todayTasks = tasks.filter((task) => {
    if (task && task.deadline) {
      return moment(task.deadline).isSame(today, "day")
    }
    return false
  })
  const tomorrowTasks = tasks.filter((task) => {
    if (task && task.deadline) {
      return moment(task.deadline).isSame(tomorrow, "day")
    }
    return false
  })

  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  // TODO: Update with most COMPLETED tasks
  const [{ contributors }] = useQuery(getContributors, {
    where: { projectId: projectId },
    take: 3,
    orderBy: {
      tasks: {
        _count: "desc",
      },
    },
    include: {
      user: true,
    },
  })

  // TODO: Update this with additional filter for COMPLETED
  const [{ tasks: pastDueTasks }] = useQuery(getTasks, {
    where: {
      project: { id: projectId },
      deadline: {
        lt: today.toDate(),
      },
    },
    orderBy: { id: "asc" },
  })

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row justify-between">
        {/* Personal tasks */}
        <div className="flex flex-col rounded bg-base-200 p-4">
          <h4>Your upcoming tasks</h4>
          <div>
            <p>Today</p>
            <Table
              columns={tasksColumns}
              data={todayTasks}
              classNames={{
                thead: "text-sm",
                tbody: "text-sm",
              }}
            />
          </div>
          <div>
            <p>Tomorrow</p>
            <Table
              columns={tasksColumns}
              data={tomorrowTasks}
              classNames={{
                thead: "text-sm",
                tbody: "text-sm",
              }}
            />
          </div>
          <Link className="btn self-end m-4" href={Routes.TasksPage({ projectId: projectId! })}>
            Show all tasks
          </Link>
        </div>

        {/* General stats */}
        {currentContributor.role == ContributorRole.PROJECT_MANAGER && (
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Contributors</div>
              <div className="stat-value">{projectStats.allContributor}</div>
              {/* <div className="stat-desc">↗︎ 14 (22%)</div> */}
            </div>

            <div className="stat">
              <div className="stat-title">Teams</div>
              <div className="stat-value">{projectStats.allTeams}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Tasks</div>
              <div className="stat-value">{projectStats.allTask}</div>
            </div>
          </div>
        )}

        {/* Most prolific contributors */}
        {currentContributor.role == ContributorRole.PROJECT_MANAGER && (
          <div className="flex flex-col rounded bg-base-200 p-4">
            <h4>Most prolific contributors</h4>
            <ul className="ml-4">
              {contributors.map((contributor) => (
                <li key={contributor.id} className="flex flex-row space-x-4 items-center">
                  <div className="bullet mr-2 w-2 h-2 bg-black rounded-full"></div>
                  <p className="font-semibold">{contributor["user"].username}</p>
                  <Link
                    className="btn"
                    href={Routes.ShowContributorPage({
                      projectId: projectId!,
                      contributorId: contributor.id,
                    })}
                  >
                    See contributions
                  </Link>
                  <Link
                    className="btn"
                    // TODO: Add <3 notif
                    href={Routes.ShowContributorPage({
                      projectId: projectId!,
                      contributorId: contributor.id,
                    })}
                  >
                    Send some {<HeartIcon className="w-5 h-5" />}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              className="btn self-end m-4"
              href={Routes.ContributorsPage({ projectId: projectId! })}
            >
              Show all contributors
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between">
        {/* Tasks over deadline */}
        {currentContributor.role == ContributorRole.PROJECT_MANAGER && (
          <div className="flex flex-col rounded bg-base-200 p-4">
            <h4>Tasks way past due</h4>
            <p>Take care of these tasks before it is too late!</p>
            <Table
              columns={pastDueTasksColumns}
              data={pastDueTasks}
              classNames={{
                thead: "text-sm",
                tbody: "text-sm",
              }}
            />
            <Link className="btn self-end m-4" href={Routes.TasksPage({ projectId: projectId! })}>
              Show all tasks
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectDashboard
