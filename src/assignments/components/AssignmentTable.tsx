// @ts-nocheck
// issues with queries/params in cell

import React, { useState } from "react"
import { Prisma } from "db"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Modal from "src/core/components/Modal"
import CompleteTogglePM from "./CompleteTogglePM"

import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { CompletedAs } from "db"
import getContributor from "src/contributors/queries/getContributor"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import CompleteSchemaPM from "src/assignments/components/CompleteSchemaPM"

export type AssignmentWithRelations = Prisma.AssignmentGetPayload<{
  include: {
    task: true
    contributor: {
      include: {
        user: true
      }
    }
    statusLogs: true
    // team: true
  }
}>

// TODO: Is it better to call the database for column name every time or just one time and pass the value to child components?
// Column helper
const columnHelper = createColumnHelper<AssignmentWithRelations>()

export const AssignmentMetadataModal = ({ metadata }) => {
  const [openModal, setOpenModal] = useState(false)
  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }
  return (
    <>
      <div className="mt-4">
        <button type="button" className="btn btn-primary" onClick={handleToggle}>
          Edit Form Data
        </button>

        <Modal open={openModal} size="w-11/12 max-w-3xl">
          <div className="modal-action">
            {metadata ? (
              <div>{JSON.stringify(metadata, null, 2)}</div>
            ) : (
              <span>No metadata provided</span>
            )}
            {/* Closes the modal */}
            <button type="button" className="btn btn-primary" onClick={handleToggle}>
              Close
            </button>
          </div>
        </Modal>
      </div>
    </>
  )
}

export const AssignmentToggleModal = ({ assignment }) => {
  const [openModal, setOpenModal] = useState(false)
  const currentUser = useCurrentUser()
  const projectId = useParam("projectId", "number")
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })
  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }
  const handleToggleClose = () => {
    setOpenModal((prev) => !prev)
    window.location.reload()
  }

  //console.log(assignment)

  return (
    <>
      <div className="mt-4">
        <button type="button" className="btn btn-primary" onClick={handleToggle}>
          Edit Completion
        </button>
        <Modal open={openModal} size="w-11/12 max-w-3xl">
          <div className="modal-action justify-between">
            <CompleteTogglePM
              currentAssignment={assignment}
              completedLabel="Completed"
              completedBy={currentContributor.id}
              completedAs={assignment.teamId ? CompletedAs.TEAM : CompletedAs.INDIVIDUAL}
            />
            <button type="button" className="btn btn-primary" onClick={handleToggleClose}>
              Save and Refresh
            </button>
          </div>
        </Modal>
      </div>
    </>
  )
}

export function getName(info) {
  if (info.contributorId != null && info.hasOwnProperty("contributor") && info.contributor.user) {
    const { firstName, lastName, username } = info.contributor.user
    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }
    return username
  }
  return "null"
}

// ColumnDefs
export const assignmentTableColumns: ColumnDef<AssignmentWithRelations>[] = [
  columnHelper.accessor("contributor", {
    cell: (info) => (
      // <span>{`${info.row.original.contributor.user.firstName} ${info.row.original.contributor.user.lastName}`}</span>
      <span>{`${getName(info.row.original)}`}</span>
    ),
    header: "Contributor Name",
  }),
  columnHelper.accessor(
    (row) =>
      row.statusLogs[0]?.createdAt.toLocaleDateString("en-us", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      }),
    {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Last Update",
      id: "updatedAt",
    }
  ),
  columnHelper.accessor((row) => row.statusLogs[0]?.status, {
    cell: (info) => <span>{info.getValue() === "COMPLETED" ? "Completed" : "Not Completed"}</span>,
    header: "Status",
    id: "status",
  }),
  columnHelper.accessor((row) => row, {
    cell: (info) => {
      return (
        <div>
          <AssignmentToggleModal assignment={info.getValue()} />
        </div>
      )
    },
    header: "Change status",
    id: "updateStatus",
  }),
]

export const assignmentTableColumnsSchema: ColumnDef<AssignmentWithRelations>[] = [
  columnHelper.accessor("contributor.user", {
    cell: (info) => (
      // <span>{`${info.row.original.contributor.user.firstName} ${info.row.original.contributor.user.lastName}`}</span>
      <span>{`${getName(info.row.original)}`}</span>
    ),
    header: "Contributor Name",
  }),
  columnHelper.accessor(
    (row) =>
      row.statusLogs[0]?.createdAt.toLocaleDateString("en-us", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      }),
    {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Last Update",
      id: "updatedAt",
    }
  ),
  columnHelper.accessor((row) => row.statusLogs[0]?.status, {
    cell: (info) => <span>{info.getValue() === "COMPLETED" ? "Completed" : "Not Completed"}</span>,
    header: "Status",
    id: "status",
  }),
  columnHelper.accessor((row) => row, {
    cell: (info) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const currentUser = useCurrentUser()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const projectId = useParam("projectId", "number")
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [currentContributor] = useQuery(getContributor, {
        where: { projectId: projectId, userId: currentUser!.id },
      })
      console.log(info.getValue())

      return (
        <CompleteSchemaPM
          currentAssignment={info.getValue()}
          completedBy={currentContributor.id}
          completedAs={CompletedAs.INDIVIDUAL}
          schema={info.getValue().task.schema}
          ui={info.getValue().task.ui}
        />
      )
    },
    header: "Form Data",
  }),
]
