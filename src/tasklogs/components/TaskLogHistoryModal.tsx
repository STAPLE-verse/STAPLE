import { useState } from "react"
import Modal from "src/core/components/Modal"
import Table from "src/core/components/Table"
import {
  assignmentHistoryTableColumns,
  assignmentHistoryTableColumnsNoMeta,
} from "./TaskLogHistoryTable"
import { Prisma } from "@prisma/client"
import { processTaskLogHistory } from "src/tasklogs/utils/processTaskLogs"
import { ExtendedTaskLog } from "../hooks/useTaskLogData"

type AssignmentHistoryModalProps = {
  taskLogs: ExtendedTaskLog[]
  schema?: Prisma.JsonValue
  ui?: Prisma.JsonValue
}
export const AssignmentHistoryModal = ({ taskLogs, schema, ui }: AssignmentHistoryModalProps) => {
  const [openModal, setOpenModal] = useState(false)

  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  const processedAssignmentHistory = processTaskLogHistory(taskLogs, schema, ui)

  return (
    <>
      <div className="">
        <button type="button" className="btn btn-primary" onClick={handleToggle}>
          Show History
        </button>

        <Modal open={openModal} size="w-11/12 max-w-3xl">
          <h1 className="flex justify-center mb-2 text-3xl">Task History</h1>
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
              addPagination={true}
            />
            {/* Closes the modal */}
            <div className="flex justify-end mt-2">
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
