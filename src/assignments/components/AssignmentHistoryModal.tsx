import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useState } from "react"
import Modal from "src/core/components/Modal"
import Table from "src/core/components/Table"
import { ExtendedAssignmentStatusLog } from "../hooks/useAssignmentData"
import { AssignmentMetadataModal } from "./AssignmentMetadataModal"

// Column helper
const columnHelper = createColumnHelper<ExtendedAssignmentStatusLog>()

// ColumnDefs
const assignmentHistoryTableColumns: ColumnDef<ExtendedAssignmentStatusLog>[] = [
  columnHelper.accessor((row) => row.contributor?.user.username || "Task created", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Changed By",
    id: "changedBy",
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
const assignmentHistoryTableColumnsNoMeta: ColumnDef<ExtendedAssignmentStatusLog>[] = [
  columnHelper.accessor((row) => row.contributor?.user.username || "Task created", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Changed By",
    id: "changedBy",
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
