// @ts-nocheck
// issue with !.title

import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { Prisma } from "@prisma/client"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { createColumnHelper } from "@tanstack/react-table"
import { useRouter } from "next/router"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useState, useEffect } from "react"

const columnHelper = createColumnHelper<Forms>()
export const projectFormTableColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Task",
  }),
  columnHelper.accessor("schema", {
    cell: (info) => <span> {info.getValue() ? info.getValue()!.title : ""}</span>,
    header: "Form Required",
  }),
  columnHelper.accessor("id", {
    id: "view",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-primary"
        href={Routes.ShowFormPage({
          taskId: info.getValue(),
          projectId: useParam("projectId", "number"),
        })}
      >
        View
      </Link>
    ),
    header: "View",
  }),
]

export const ProjectFormTable = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")

  const ITEMS_PER_PAGE = 10
  const page = Number(router.query.page) || 0
  const goToPreviousPage = () => router.push({ query: { projectId: projectId, page: page - 1 } })
  const goToNextPage = () => router.push({ query: { projectId: projectId, page: page + 1 } })

  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: {
      project: { id: projectId! },
      schema: {
        not: undefined,
        not: Prisma.DbNull,
      }, // schema must be defined and not empty DB
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  console.log(tasks)

  return (
    <div>
      <Table data={tasks} columns={projectFormTableColumns} />
      <div className="join grid grid-cols-2 my-6">
        <button
          className="join-item btn btn-secondary"
          disabled={page === 0}
          onClick={goToPreviousPage}
        >
          Previous
        </button>
        <button className="join-item btn btn-secondary" disabled={!hasMore} onClick={goToNextPage}>
          Next
        </button>
      </div>
    </div>
  )
}
