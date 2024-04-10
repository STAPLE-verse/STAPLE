import React, { useState } from "react"
import { Assignment, Prisma } from "db"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Modal from "src/core/components/Modal"

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

const AssignmentMetadataModal = ({ metadata }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  return (
    <>
      <div className="mt-4">
        <button type="button" className="btn" onClick={handleToggle}>
          Show metadata
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

function getName(info) {
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
  columnHelper.accessor("contributor.user", {
    cell: (info) => (
      // <span>{`${info.row.original.contributor.user.firstName} ${info.row.original.contributor.user.lastName}`}</span>
      <span>{`${getName(info.row.original)}`}</span>
    ),
    header: "Contributor Name",
  }),
  columnHelper.accessor((row) => row.statusLogs[0]?.createdAt.toISOString(), {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Last update",
    id: "updatedAt",
  }),
  columnHelper.accessor((row) => row.statusLogs[0]?.status, {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Status",
    id: "status",
  }),
  columnHelper.accessor("task.schema", {
    cell: (info) => (
      <>
        {info.row.original.task.schema ? (
          <AssignmentMetadataModal metadata={info.row.original.statusLogs[0]?.metadata} />
        ) : (
          <span>No schema provided</span>
        )}
      </>
    ),
    header: "Task Schema",
  }),
]
