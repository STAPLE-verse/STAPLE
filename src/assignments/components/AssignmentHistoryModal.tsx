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
  columnHelper.accessor((row) => row.changedAt.toISOString(), {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Last Update",
    id: "changedAt",
  }),
  columnHelper.accessor((row) => row.status, {
    cell: (info) => <span>{info.getValue()}</span>,
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
    header: "Assignment Metadata",
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
      <div className="mt-4">
        <button type="button" className="btn" onClick={handleToggle}>
          Show assignment history
        </button>

        <Modal open={openModal} size="w-11/12 max-w-3xl">
          <div className="modal-action flex flex-col">
            <Table
              columns={assignmentHistoryTableColumns}
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
