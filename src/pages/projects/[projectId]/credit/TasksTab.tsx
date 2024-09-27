import { Suspense, useState } from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"
import React from "react"
import Modal from "src/core/components/Modal"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import Table from "src/core/components/Table"
import { TaskLabelInformation, labelTaskTableColumns } from "src/labels/components/LabelTaskTable"
import getTasks from "src/tasks/queries/getTasks"
import { useParam } from "@blitzjs/next"
import updateTaskLabel from "src/tasks/mutations/updateTaskLabel"
import { LabelIdsFormSchema } from "src/labels/schemas"
import { AddLabelForm } from "src/labels/components/AddLabelForm"

export const AllTasksLabelsList = ({ tasks, onChange }) => {
  const [updateTaskLabelMutation] = useMutation(updateTaskLabel)
  const [selectedIds, setSelectedIds] = useState([] as number[])
  const projectId = useParam("projectId", "number")

  const labelChanged = async () => {
    if (onChange != undefined) {
      onChange()
    }
  }
  const handleMultipleChanged = (selectedId: number) => {
    const isSelected = selectedIds.includes(selectedId)

    const newSelectedIds = isSelected
      ? selectedIds.filter((id) => id !== selectedId)
      : [...selectedIds, selectedId]

    setSelectedIds(newSelectedIds)
  }

  const [openEditLabelModal, setOpenEditLabelModal] = useState(false)
  const handleToggleEditLabelModal = () => {
    setOpenEditLabelModal((prev) => !prev)
  }

  const handleAddLabel = async (values) => {
    try {
      const updated = await updateTaskLabelMutation({
        ...values,
        tasksId: selectedIds,
        disconnect: false,
      })
      await labelChanged()
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding roles to tasks...",
        success: "Roles added!",
        error: "Failed to add the roles...",
      })
      handleToggleEditLabelModal()
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const initialValues = {
    labelsId: [],
  }

  const taskInformation = tasks.map((task) => {
    const name = task.name
    const description = task.description || ""

    let t: TaskLabelInformation = {
      name: name,
      description: description,
      id: task.id,
      labels: task.labels,
      selectedIds: selectedIds,
      onChangeCallback: labelChanged,
      onMultipledAdded: handleMultipleChanged,
    }
    return t
  })
  const hasElements = tasks.length < 1 || selectedIds.length < 1

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <Table columns={labelTaskTableColumns} data={taskInformation} addPagination={true} />

      <div className="modal-action flex justify-end mt-4">
        <button
          type="button"
          /* button for popups */
          className="btn btn-primary"
          disabled={hasElements}
          onClick={handleToggleEditLabelModal}
        >
          Add Multiple
        </button>

        <Modal open={openEditLabelModal} size="w-7/8 max-w-xl">
          <div className="">
            <h1 className="flex justify-center mb-2 text-3xl">Add Roles</h1>
            <div className="flex justify-start mt-4">
              <AddLabelForm
                projectId={projectId}
                schema={LabelIdsFormSchema}
                submitText="Update Role"
                className="flex flex-col"
                onSubmit={handleAddLabel}
                initialValues={initialValues}
              ></AddLabelForm>
            </div>

            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button
                type="button"
                /* button for popups */
                className="btn btn-secondary"
                onClick={handleToggleEditLabelModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  )
}

const TasksTab = () => {
  const projectId = useParam("projectId", "number")

  const [{ tasks }, { refetch }] = useQuery(getTasks, {
    where: { project: { id: projectId! } },
    include: { labels: true },
    orderBy: { id: "asc" },
  })

  const reloadTable = async () => {
    await refetch()
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AllTasksLabelsList tasks={tasks} onChange={reloadTable} />
        </Suspense>
      </div>
    </main>
  )
}

export default TasksTab
