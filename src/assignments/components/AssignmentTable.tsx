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

// ColumnDefs
export const assignmentTableColumns: ColumnDef<AssignmentWithRelations>[] = [
  columnHelper.accessor("contributor.user", {
    cell: (info) => (
      <span>{`${info.row.original.contributor.user.firstName} ${info.row.original.contributor.user.lastName}`}</span>
    ),
    header: "Contributor Name",
  }),
  columnHelper.accessor("updatedAt", {
    cell: (info) => <span>{info.getValue().toString()}</span>,
    header: "Last update",
  }),
  columnHelper.accessor("status", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Status",
  }),
  columnHelper.accessor("task.schema", {
    cell: (info) => (
      <>
        {info.row.original.task.schema ? (
          <AssignmentMetadataModal metadata={info.row.original.metadata} />
        ) : (
          <span>No schema provided</span>
        )}
      </>
    ),
    header: "Task Schema",
  }),
]
