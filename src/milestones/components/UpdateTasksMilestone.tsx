import React from "react"
import Modal from "src/core/components/Modal"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import Form from "src/core/components/fields/Form"
import { Task } from "db"
import { useMutation } from "@blitzjs/rpc"
import { UpdateTasksForMilestoneFormSchema } from "src/tasks/schemas"
import updateTasksForMilestone from "src/tasks/mutations/updateTasksForMilestone"

type UpdateTasksMilestoneProps = {
  milestoneId: number
  open: boolean
  onClose: () => void
  onTasksUpdated: () => void
  tasks: Task[]
}

const UpdateTasksMilestone: React.FC<UpdateTasksMilestoneProps> = ({
  milestoneId,
  open,
  onClose,
  onTasksUpdated,
  tasks,
}) => {
  const [updateTasksForMilestoneMutation] = useMutation(updateTasksForMilestone)

  // Determine which tasks are already assigned to the milestone
  const currentTasks = tasks.filter((task) => task.milestoneId === milestoneId)

  const taskOptions = tasks.map((task) => ({
    label: task.name,
    id: task.id,
    checked: currentTasks.some((t) => t.id === task.id), // Initially check tasks already added
  }))

  const handleSubmit = async (values) => {
    await updateTasksForMilestoneMutation({
      milestoneId: milestoneId,
      taskIds: values.selectedTasks,
    })

    onTasksUpdated()
    onClose()
  }

  return (
    <Modal open={open} size="large">
      <h1 className="flex justify-center mb-2 text-3xl">Update Tasks</h1>
      {open && (
        <>
          {taskOptions.length > 0 ? (
            <Form
              schema={UpdateTasksForMilestoneFormSchema}
              onSubmit={handleSubmit}
              initialValues={{ selectedTasks: currentTasks.map((task) => task.id) }}
              submitText="Save"
              onCancel={onClose}
              cancelText="Cancel"
            >
              <CheckboxFieldTable name="selectedTasks" options={taskOptions} />
            </Form>
          ) : (
            <div className="flex flex-col items-center">
              <p>There are no tasks available to add.</p>
              <button className="btn btn-primary mt-4" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}

export default UpdateTasksMilestone
