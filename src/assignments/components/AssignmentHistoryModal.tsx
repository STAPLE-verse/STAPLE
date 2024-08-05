import { useState } from "react"
import Modal from "src/core/components/Modal"
import Table from "src/core/components/Table"
import {
  assignmentHistoryTableColumns,
  assignmentHistoryTableColumnsNoMeta,
} from "./AssignmentHistoryTable"
import { Prisma } from "@prisma/client"
import { processAssignmentHistory } from "src/assignments/utils/processAssignments"
import { ExtendedAssignmentStatusLog } from "../hooks/useAssignmentData"

type AssignmentHistoryModalProps = {
  assignmentStatusLog: ExtendedAssignmentStatusLog[]
  schema?: Prisma.JsonValue
  ui?: Prisma.JsonValue
}
export const AssignmentHistoryModal = ({
  assignmentStatusLog,
  schema,
  ui,
}: AssignmentHistoryModalProps) => {
  const [openModal, setOpenModal] = useState(false)

  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  const processedAssignmentHistory = processAssignmentHistory(assignmentStatusLog, schema, ui)

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
                schema && ui ? assignmentHistoryTableColumns : assignmentHistoryTableColumnsNoMeta
              }
              data={processedAssignmentHistory}
              classNames={{
                thead: "text-base",
                tbody: "text-base",
              }}
            />
            {/* Closes the modal */}
            <div className="flex justify-end">
              <button type="button" className="btn btn-secondary" onClick={handleToggle}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}

export default AssignmentHistoryModal
