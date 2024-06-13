// @ts-nocheck
// issue with !.title

import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { JsonFormModal } from "src/core/components/JsonFormModal"

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
  columnHelper.accessor((row) => "view", {
    id: "view",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => {
      const uiSchema = info.row.original.uiSchema || {}
      let extendedUiSchema = {}
      // TODO: This assumes uiSchema is always an object, although the type def allows for string, number(?) as well
      // I am not sure where would we encounter those
      if (uiSchema && typeof uiSchema === "object" && !Array.isArray(uiSchema)) {
        // We do not want to show the submit button
        extendedUiSchema = {
          ...uiSchema,
          "ui:submitButtonOptions": {
            norender: true,
          },
        }
      }
      return (
        <>
          <JsonFormModal
            schema={info.row.original.schema}
            uiSchema={extendedUiSchema}
            metadata={{}}
            label="View"
          />
        </>
      )
    },
    header: "View",
  }),
  columnHelper.accessor("id", {
    id: "edit",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => "Download",
    header: "Download",
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
