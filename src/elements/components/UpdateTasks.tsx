import React from "react"
import Modal from "src/core/components/Modal"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import Form from "src/core/components/fields/Form"
import { Task } from "db"
import { useMutation } from "@blitzjs/rpc"
import updateTasksForElement from "src/tasks/mutations/updateTasksForElement"
import { UpdateTasksForElementFormSchema } from "src/tasks/schemas"

type UpdateTasksProps = {
  elementId: number
  open: boolean
  onClose: () => void
  onTasksUpdated: () => void
  tasks: Task[]
}

const UpdateTasks: React.FC<UpdateTasksProps> = ({
  elementId,
  open,
  onClose,
  onTasksUpdated,
  tasks,
}) => {
  const [updateTasksForElementMutation] = useMutation(updateTasksForElement)

  // Determine which tasks are already assigned to the element
  const currentTasks = tasks.filter((task) => task.elementId === elementId)

  const taskOptions = tasks.map((task) => ({
    label: task.name,
    id: task.id,
    checked: currentTasks.some((t) => t.id === task.id), // Initially check tasks already added
  }))

  const handleSubmit = async (values) => {
    await updateTasksForElementMutation({
      elementId: elementId,
      taskIds: values.selectedTasks,
    })

    onTasksUpdated()
    onClose()
  }

  return (
    <Modal open={open} size="large">
      <h2>Update Tasks</h2>
      {open && (
        <>
          {taskOptions.length > 0 ? (
            <Form
              schema={UpdateTasksForElementFormSchema}
              onSubmit={handleSubmit}
              initialValues={{ selectedTasks: currentTasks.map((task) => task.id) }}
              submitText="Save"
              onCancel={onClose}
              cancelText="Cancel"
            >
              <CheckboxFieldTable name="selectedTasks" options={taskOptions} />
            </Form>
          ) : (
            <p>There are no tasks available to add.</p>
          )}
        </>
      )}
    </Modal>
  )
}

export default UpdateTasks
