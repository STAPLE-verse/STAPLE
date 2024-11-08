import { useMutation } from "@blitzjs/rpc"
import createColumn from "src/tasks/mutations/createColumn"
import { useState } from "react"
import TaskInput from "./TaskInput"
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
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setShowAddContainerModal(true)}
      >
        Add Column
      </button>

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
    </>
  )
}

export default AddContainer
