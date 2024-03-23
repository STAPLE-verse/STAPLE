import { Routes, useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { Contributor, ContributorRole, Prisma, Task, TaskStatus, User, Assignment } from "db"
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
      header: "Open",
      cell: (info) => (
        <Link
          className="btn btn-sm btn-secondary"
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
      header: "Open",
      cell: (info) => (
        <Link
          className="btn btn-sm btn-secondary"
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

  type ContributorWithUser = Prisma.ContributorGetPayload<{
    include: { user: { select: { username: true; firstName: true; lastName: true } } }
  }>

  const projectManagersColumns: ColumnDef<ContributorWithUser>[] = [
    {
      accessorKey: "user.username",
      cell: (info) => <span>{info.getValue() as string}</span>,
      header: "Username",
    },
    {
      accessorKey: "user.firstName",
      cell: (info) => <span>{info.getValue() as string}</span>,
      header: "First Name",
    },
    {
      accessorKey: "user.lastName",
      cell: (info) => <span>{info.getValue() as string}</span>,
      header: "Last Name",
    },
    {
      accessorKey: "action",
      header: "Contact",
      cell: (info) => (
        <Link className="btn btn-sm btn-secondary" href="">
          Ask for help
        </Link>
      ),
    },
  ]

  const today = moment().startOf("minute")
  //const tomorrow = moment(today).add(1, "days")

  // coming up tasks for everyone
  const [{ tasks }] = useQuery(getTasks, {
    where: {
      project: { id: projectId },
      deadline: {
        gte: today.toDate(),
        //lt: moment(tomorrow).add(1, "days").toDate(),
      },
      status: TaskStatus.NOT_COMPLETED,
    },
    orderBy: { id: "asc" },
  })

  const upcomingTasks = tasks.filter((task) => {
    if (task && task.deadline) {
      return moment(task.deadline).isSameOrAfter(today, "day")
    }
    return false
  })

  //past due for everyone
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

  // coming up for Contributor
  console.log(currentContributor.userId)
  const [{ tasks: upcomingTasksContributor }] = useQuery(getTasks, {
    where: {
      project: { id: projectId },
      deadline: { lt: today.toDate() },
      status: TaskStatus.NOT_COMPLETED,
      //assignment: { assignees: currentContributor.userId },
    },
    orderBy: { id: "asc" },
  })

  // past due for contributor

  const [projectStats] = useQuery(getProjectStats, { id: projectId! })

  const [{ contributors: projectManagers }] = useQuery(getContributors, {
    where: {
      projectId: projectId,
      role: "PROJECT_MANAGER",
    },
    include: {
      user: true,
    },
  })

  return (
    <div className="flex flex-col space-y-4">
      {/* General stats row 1 across the top
        only project managers see this*/}

      {currentContributor.role == ContributorRole.PROJECT_MANAGER && (
        <div className="flex flex-row justify-center">
          <div className="stats bg-primary text-primary-content mx-2 w-1/4">
            <div className="stat">
              <div className="stat-title text-center text-primary-content">Contributors</div>
              <div className="stat-value text-center text-primary-content">
                {projectStats.allContributor}
              </div>
              <div className="stat-actions text-center text-primary-content">
                <Link
                  className="btn btn-sm btn-secondary"
                  href={Routes.ContributorsPage({ projectId: projectId! })}
                >
                  View
                </Link>
              </div>
            </div>
          </div>

          <div className="stats bg-primary text-primary-content mx-2 w-1/4">
            <div className="stat">
              <div className="stat-title text-center text-primary-content">Teams</div>
              <div className="stat-value text-center text-primary-content">
                {projectStats.allTeams}
              </div>
              <div className="stat-actions text-center text-primary-content">
                <Link
                  className="btn btn-sm btn-secondary"
                  href={Routes.TeamsPage({ projectId: projectId! })}
                >
                  View
                </Link>
              </div>
            </div>
          </div>

          <div className="stats bg-primary text-primary-content mx-2 w-1/4">
            <div className="stat">
              <div className="stat-title text-center text-primary-content">Incomplete Tasks</div>
              <div className="stat-value text-center text-primary-content">
                {projectStats.completedTask} / {projectStats.allTask}
              </div>
              <div className="stat-actions text-center text-primary-content">
                <Link
                  className="btn btn-sm btn-secondary"
                  href={Routes.TasksPage({ projectId: projectId! })}
                >
                  View
                </Link>
              </div>
            </div>
          </div>

          <div className="stats bg-primary text-primary-content mx-2 w-1/4">
            <div className="stat">
              <div className="stat-title text-center text-primary-content">Form Data</div>
              <div className="stat-value text-center text-primary-content">XX</div>
              <div className="stat-actions text-center text-primary-content">
                <button className="btn btn-sm btn-secondary">Coming Soon</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* row 2 for recent events*/}
      <div className="flex flex-row justify-center">
        <div className="card bg-primary text-primary-content mx-2 w-1/2">
          <div className="card-body">
            <div className="card-title text-primary-content">Recent Events</div>
            - if project manager: show everyone's recent Events <br />
            - if contributor: show your recent events <br />
          </div>
        </div>

        <div className="card bg-primary text-primary-content mx-2 w-1/2">
          <div className="card-body">
            <div className="card-title text-primary-content">Task Summary</div>
            <b>Upcoming:</b> <br />
            {upcomingTasks.length === 0 ? (
              <p className="italic p-2">No upcoming tasks</p>
            ) : (
              <Table
                columns={tasksColumns}
                data={upcomingTasks}
                classNames={{
                  thead: "text-sm text-primary-content",
                  tbody: "text-sm text-primary-content",
                  td: "text-sm text-primary-content",
                }}
              />
            )}
            <b>Overdue:</b> <br />
            {pastDueTasks.length === 0 ? (
              <p className="italic p-2">No overdue tasks</p>
            ) : (
              <Table
                columns={pastDueTasksColumns}
                data={pastDueTasks}
                classNames={{
                  thead: "text-sm text-primary-content",
                  tbody: "text-sm text-primary-content",
                  td: "text-sm text-primary-content",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* row 3 for announcements events*/}
      <div className="flex flex-row justify-center">
        <div className="card bg-primary text-primary-content mx-2 w-1/2">
          <div className="card-body">
            <div className="card-title text-primary-content">Announcements</div>
          </div>
        </div>

        <div className="stats bg-primary text-primary-content mx-2 w-1/2">
          <div className="card-body">
            <div className="card-title text-primary-content">Notifications</div>
          </div>
        </div>
      </div>

      {/* row 4 for contributors*/}
      <div className="flex flex-row justify-center">
        <div className="card bg-primary text-primary-content mx-2 w-full">
          <div className="card-body">
            <div className="card-title text-primary-content">Project Managers</div>
            <b>Contacts for the Project: </b>
            <br />
            <Table
              columns={projectManagersColumns}
              data={projectManagers}
              classNames={{
                thead: "text-sm text-primary-content",
                tbody: "text-sm text-primary-content",
                td: "text-sm text-primary-content",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDashboard
