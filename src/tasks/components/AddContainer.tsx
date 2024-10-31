import { useMutation } from "@blitzjs/rpc"
import createColumn from "src/tasks/mutations/createColumn"
import { useState } from "react"
import TaskInput from "./TaskInput"
import { Tooltip } from "react-tooltip"
import Modal from "src/core/components/Modal"

const AddContainer = ({ projectId, refetch }) => {
  const [createColumnMutation] = useMutation(createColumn)

  const [showAddContainerModal, setShowAddContainerModal] = useState(false)
  const handleToggleContainerModal = () => {
    setShowAddContainerModal((prev) => !prev)
  }

  const [containerName, setContainerName] = useState("")

  const onAddContainer = async () => {
    if (!containerName) return
    await createColumnMutation({ projectId: projectId, name: containerName })
    setContainerName("")
    handleToggleContainerModal()
    refetch()
  }

  return (
    <>
      <Modal open={showAddContainerModal}>
        <h1 className="flex justify-center mb-2 text-3xl">Add Column</h1>
        <TaskInput
          type="text"
          placeholder="Container Title"
          name="containername"
          value={containerName}
          onChange={(e) => setContainerName(e.target.value)}
        />
        <div className="flex justify-between w-full mt-4">
          <button type="button" className="btn btn-primary" onClick={onAddContainer}>
            Add Column
          </button>
          <button
            type="button"
            className="btn btn-secondary ml-2"
            onClick={handleToggleContainerModal}
          >
            Close
          </button>
        </div>
      </Modal>

      <div className="flex items-center justify-between gap-y-2">
        <h1 className="text-3xl font-bold" data-tooltip-id="kanban-tooltip">
          Project Tasks
        </h1>
        <Tooltip
          id="kanban-tooltip"
          content="Completed tasks appear in a shade of green"
          className="z-[1099] ourtooltips"
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowAddContainerModal(true)}
        >
          Add Column
        </button>
      </div>
    </>
  )
}

export default AddContainer
