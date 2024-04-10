import { Routes, useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { Contributor, ContributorPrivileges, Prisma, Task, TaskStatus, User } from "db"
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

  interface ProlificContributor extends Contributor {
    user: User
    completedTasksCount: number
  }

  const prolificContributorsColumns: ColumnDef<ProlificContributor>[] = [
    {
      accessorKey: "user.username",
      cell: (info) => <span>{info.getValue() as string}</span>,
      header: "Username",
    },
    {
      accessorFn: (row) => row.completedTasksCount,
      id: "completedTasksCount",
      cell: (info) => <span>{info.getValue() as number}</span>,
      header: "Number of Completed Tasks",
    },
    {
      id: "actions",
      header: "",
      cell: (info) => {
        const contributor = info.row.original
        // Assuming `projectId` is available in the component's scope. You may need to adjust this.
        return (
          <div>
            <Link
              className="btn"
              href={Routes.ShowContributorPage({
                projectId: contributor.projectId, // Adjust according to how you have projectId available
                contributorId: contributor.id,
              })}
            >
              See contributions
            </Link>
            <Link
              className="btn"
              href={Routes.ShowContributorPage({
                projectId: contributor.projectId, // Adjust according to how you have projectId available
                contributorId: contributor.id,
              })}
            >
              Send some <HeartIcon className="w-5 h-5 inline-block" />
            </Link>
          </div>
        )
      },
    },
  ]

  type ContributorWithUser = Prisma.ContributorGetPayload<{
    include: { user: { select: { username: true; firstName: true; lastName: true } } }
  }>

  // ColumnDefs
  const projectManagersColumns: ColumnDef<ContributorWithUser>[] = [
    {
      accessorKey: "user.username",
      cell: (info) => <span>{info.getValue() as string}</span>,
      header: "Username",
    },
    {
      accessorKey: "action",
      header: "",
      cell: (info) => (
        <Link className="btn" href="">
          Ask for help
        </Link>
      ),
    },
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
      status: TaskStatus.NOT_COMPLETED,
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

  const [contributors] = useQuery(getProlificContributors, { projectId: projectId! })

  const [{ contributors: projectManagers }] = useQuery(getContributors, {
    where: {
      projectId: projectId,
      privilege: "PROJECT_MANAGER",
    },
    include: {
      user: true,
    },
  })

  const [{ tasks: pastDueTasks }] = useQuery(getTasks, {
    where: {
      project: { id: projectId },
      deadline: {
        lt: today.toDate(),
      },
      status: TaskStatus.NOT_COMPLETED,
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
            <p className="font-semibold">Today</p>
            {todayTasks.length === 0 ? (
              <p className="italic p-2">You have no tasks for today. Hurray!</p>
            ) : (
              <Table
                enableFilters={false}
                columns={tasksColumns}
                data={todayTasks}
                classNames={{
                  thead: "text-sm",
                  tbody: "text-sm",
                }}
              />
            )}
          </div>
          <div>
            <p className="font-semibold">Tomorrow</p>
            {tomorrowTasks.length === 0 ? (
              <p className="italic p-2">You have no tasks for tomorrow. Hurray!</p>
            ) : (
              <Table
                enableFilters={false}
                columns={tasksColumns}
                data={tomorrowTasks}
                classNames={{
                  thead: "text-sm",
                  tbody: "text-sm",
                }}
              />
            )}
          </div>
          <Link className="btn self-end m-4" href={Routes.TasksPage({ projectId: projectId! })}>
            Show all tasks
          </Link>
        </div>

        {/* Most prolific contributors */}
        {currentContributor.privilege == ContributorPrivileges.PROJECT_MANAGER && (
          <div className="flex flex-col rounded bg-base-200 p-4">
            <h4>Most prolific contributors</h4>
            <Table
              enableFilters={false}
              columns={prolificContributorsColumns}
              data={contributors}
              classNames={{
                thead: "text-sm",
                tbody: "text-sm",
              }}
            />
            <Link
              className="btn self-end m-4"
              href={Routes.ContributorsPage({ projectId: projectId! })}
            >
              Show all contributors
            </Link>
          </div>
        )}

        {/* General stats */}
        {currentContributor.privilege == ContributorPrivileges.PROJECT_MANAGER && (
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
      </div>
      <div className="flex flex-row justify-between">
        {/* Tasks over deadline */}
        {currentContributor.privilege == ContributorPrivileges.PROJECT_MANAGER && (
          <div className="flex flex-col rounded bg-base-200 p-4">
            <h4>Tasks way past due</h4>
            <p>Take care of these tasks before it is too late!</p>
            {pastDueTasks.length === 0 ? (
              <p className="italic p-2">All contributors are on the right track!</p>
            ) : (
              <Table
                enableFilters={false}
                columns={pastDueTasksColumns}
                data={pastDueTasks}
                classNames={{
                  thead: "text-sm",
                  tbody: "text-sm",
                }}
              />
            )}
            <Link className="btn self-end m-4" href={Routes.TasksPage({ projectId: projectId! })}>
              Show all tasks
            </Link>
          </div>
        )}
        {/* List of project managers */}
        {currentContributor.privilege == ContributorPrivileges.CONTRIBUTOR && (
          <div className="flex flex-col rounded bg-base-200 p-4">
            <h4>Project managers</h4>
            <p>Ping them if you need help</p>
            <Table
              columns={projectManagersColumns}
              data={projectManagers}
              classNames={{
                thead: "text-sm",
                tbody: "text-sm",
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectDashboard
