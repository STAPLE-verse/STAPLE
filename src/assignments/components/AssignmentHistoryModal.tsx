import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { AssignmentStatusLog } from "db"
import { useState } from "react"
import Modal from "src/core/components/Modal"
import { AssignmentMetadataModal } from "./AssignmentTable"
import Table from "src/core/components/Table"

// Column helper
const columnHelper = createColumnHelper<AssignmentStatusLog>()

// ColumnDefs
const assignmentHistoryTableColumns: ColumnDef<AssignmentStatusLog>[] = [
  columnHelper.accessor("completedBy", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Changed By",
  }),
  columnHelper.accessor(
    (row) =>
      row.createdAt.toLocaleDateString(undefined, {
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
      id: "createdAt",
    }
  ),
  columnHelper.accessor((row) => row.status, {
    cell: (info) => <span>{info.getValue() === "COMPLETED" ? "Completed" : "Not Completed"}</span>,
    header: "Status",
    id: "status",
  }),
  columnHelper.accessor("metadata", {
    cell: (info) => (
      <>
        {info.row.original ? (
          <AssignmentMetadataModal metadata={info.getValue()} />
        ) : (
          <span>No metadata provided</span>
        )}
      </>
    ),
    header: "Form Data",
  }),
]
const assignmentHistoryTableColumnsNoMeta: ColumnDef<AssignmentStatusLog>[] = [
  columnHelper.accessor("completedBy", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Changed By",
  }),
  columnHelper.accessor(
    (row) =>
      row.createdAt.toLocaleDateString(undefined, {
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
      id: "createdAt",
    }
  ),
  columnHelper.accessor((row) => row.status, {
    cell: (info) => <span>{info.getValue() === "COMPLETED" ? "Completed" : "Not Completed"}</span>,
    header: "Status",
    id: "status",
  }),
]

// AssignmentHistoryModal definition
export const AssignmentHistoryModal = ({ assignmentStatusLog }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  return (
    <>
      <div className="">
        <button type="button" className="btn btn-primary" onClick={handleToggle}>
          Show History
        </button>

        <Modal open={openModal} size="w-11/12 max-w-3xl">
          <div className="modal-action flex flex-col">
            <Table
              columns={
                assignmentStatusLog[0].metadata
                  ? assignmentHistoryTableColumns
                  : assignmentHistoryTableColumnsNoMeta
              }
              data={assignmentStatusLog}
              classNames={{
                thead: "text-base",
                tbody: "text-base",
              }}
            />
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

export default AssignmentHistoryModal
