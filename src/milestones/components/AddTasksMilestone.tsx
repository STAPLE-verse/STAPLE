import React, { useState } from "react"
import Modal from "src/core/components/Modal"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import { Task } from "db"

type AddTasksMilestoneProps = {
  tasks: Task[]
}

const AddTasksMilestone: React.FC<AddTasksMilestoneProps> = ({ tasks }) => {
  const [openRolesModal, setRolesModal] = useState(false)
  const handleToggleRolesModal = () => setRolesModal((prev) => !prev)

  return (
    <>
      <Modal open={open} size="large">
        <h1 className="flex justify-center mb-2 text-3xl">Add Tasks</h1>
        {taskOptions.length > 0 ? (
          <>
            <CheckboxFieldTable name="selectedTasks" options={taskOptions} />
            <div className="flex justify-end mt-4 gap-2">
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <p>There are no tasks available to add.</p>
            <button className="btn btn-primary mt-4" onClick={handleClose}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </>
  )
}

export default AddTasksMilestone
