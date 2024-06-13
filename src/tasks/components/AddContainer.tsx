import { useMutation } from "@blitzjs/rpc"
import createColumn from "src/tasks/mutations/createColumn"
import { useState } from "react"
import TaskModal from "./TaskModal"
import TaskInput from "./TaskInput"

const AddContainer = ({ projectId, refetch }) => {
  const [createColumnMutation] = useMutation(createColumn)

  const [showAddContainerModal, setShowAddContainerModal] = useState(false)
  const [containerName, setContainerName] = useState("")

  const onAddContainer = async () => {
    if (!containerName) return
    await createColumnMutation({ projectId: projectId, name: containerName })
    setContainerName("")
    setShowAddContainerModal(false)
    refetch()
  }

  return (
    <>
      <TaskModal showModal={showAddContainerModal} setShowModal={setShowAddContainerModal}>
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-3xl font-bold">Add Container</h1>
          <TaskInput
            type="text"
            placeholder="Container Title"
            name="containername"
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
          />
          <button type="button" className="btn btn-primary" onClick={onAddContainer}>
            Add container
          </button>
        </div>
      </TaskModal>

      <div className="flex items-center justify-between gap-y-2">
        <h1 className="text-3xl font-bold">Project Tasks</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowAddContainerModal(true)}
        >
          Add Container
        </button>
      </div>
    </>
  )
}

export default AddContainer
