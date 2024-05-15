import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import Table from "src/core/components/Table"
import moment from "moment"
import { tasksColumns } from "./ColumnHelpers"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

const UpcomingTask = ({ currentUser }) => {
  const [{ tasks }, { isLoading }] = useQuery(getTasks, {
    include: {
      project: { select: { name: true } },
    },
    where: {
      assignees: { some: { contributor: { user: { id: currentUser?.id } } } },
      deadline: { gte: moment().startOf("day").toDate() },
      status: "NOT_COMPLETED",
    },
    orderBy: { id: "desc" },
  })

  const upcomingTasks = tasks.filter((task) => moment(task.deadline).isSameOrAfter(moment(), "day"))

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  if (upcomingTasks.length === 0) return <p className="italic p-2">No upcoming tasks</p>

  return (
    <>
      <div className="card-body">
        <div className="card-title text-base-content">Upcoming Tasks</div>
        <Table
          columns={tasksColumns}
          data={upcomingTasks}
          classNames={{
            thead: "text-sm text-base-content",
            tbody: "text-sm text-base-content",
            td: "text-sm text-base-content",
          }}
        />
      </div>
      <div className="card-actions justify-end">
        {" "}
        <Link className="btn btn-primary self-end m-4" href={Routes.AllTasksPage()}>
          {" "}
          Show all tasks{" "}
        </Link>
      </div>
    </>
  )
}

export default UpcomingTask
