import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import Table from "src/core/components/Table"
import moment from "moment"
import { tasksColumns } from "./ColumnHelpers"
import Link from "next/link"
import { Routes } from "@blitzjs/next/dist/index-browser"

const OverdueTask = ({ currentUser }) => {
  const [{ tasks }, { isLoading }] = useQuery(getTasks, {
    include: {
      project: { select: { name: true } },
    },
    where: {
      assignees: { some: { contributor: { user: { id: currentUser?.id } } } },
      deadline: { lt: moment().toDate() },
      status: "NOT_COMPLETED",
    },
    orderBy: { id: "desc" },
  })

  const overdueTasks = tasks.filter((task) => moment(task.deadline).isBefore(moment(), "minute"))

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  if (overdueTasks.length === 0) return <p className="italic p-2">No overdue tasks</p>

  return (
    <>
      <div className="card-body">
        <div className="card-title text-base-content">Tasks Overdue</div>
        <Table
          columns={tasksColumns}
          data={overdueTasks}
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

export default OverdueTask
