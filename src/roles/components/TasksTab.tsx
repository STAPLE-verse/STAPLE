import { Suspense, useState } from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"
import React from "react"
import Modal from "src/core/components/Modal"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import Table from "src/core/components/Table"
import { TaskRoleInformation, roleTaskTableColumns } from "src/roles/components/RoleTaskTable"
import getTasks from "src/tasks/queries/getTasks"
import { useParam } from "@blitzjs/next"
import updateTaskRole from "src/tasks/mutations/updateTaskRole"
import { RoleIdsFormSchema } from "src/roles/schemas"
import { AddRoleForm } from "src/roles/components/AddRoleForm"

export const AllTasksRolesList = ({ tasks, onChange }) => {
  const [updateTaskRoleMutation] = useMutation(updateTaskRole)
  const [selectedIds, setSelectedIds] = useState([] as number[])
  const projectId = useParam("projectId", "number")

  const roleChanged = async () => {
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

  const [openEditRoleModal, setOpenEditRoleModal] = useState(false)
  const handleToggleEditRoleModal = () => {
    setOpenEditRoleModal((prev) => !prev)
  }

  const handleAddRole = async (values) => {
    try {
      const updated = await updateTaskRoleMutation({
        ...values,
        tasksId: selectedIds,
        disconnect: false,
      })
      await roleChanged()
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding roles to tasks...",
        success: "Roles added!",
        error: "Failed to add the roles...",
      })
      handleToggleEditRoleModal()
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const initialValues = {
    rolesId: [],
  }

  const taskInformation = tasks.map((task) => {
    const name = task.name
    const description = task.description || ""

    let t: TaskRoleInformation = {
      name: name,
      description: description,
      id: task.id,
      roles: task.roles,
      selectedIds: selectedIds,
      onChangeCallback: roleChanged,
      onMultipledAdded: handleMultipleChanged,
    }
    return t
  })
  const hasElements = tasks.length < 1 || selectedIds.length < 1

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <Table columns={roleTaskTableColumns} data={taskInformation} addPagination={true} />

      <div className="modal-action flex justify-end mt-4">
        <button
          type="button"
          /* button for popups */
          className="btn btn-primary"
          disabled={hasElements}
          onClick={handleToggleEditRoleModal}
        >
          Add Multiple
        </button>

        <Modal open={openEditRoleModal} size="w-7/8 max-w-xl">
          <div className="">
            <h1 className="flex justify-center mb-2 text-3xl">Add Roles</h1>
            <div className="flex justify-start mt-4">
              <AddRoleForm
                projectId={projectId}
                schema={RoleIdsFormSchema}
                submitText="Update Role"
                className="flex flex-col"
                onSubmit={handleAddRole}
                initialValues={initialValues}
              ></AddRoleForm>
            </div>

            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button
                type="button"
                /* button for popups */
                className="btn btn-secondary"
                onClick={handleToggleEditRoleModal}
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
    include: { roles: true },
    orderBy: { id: "asc" },
  })

  const reloadTable = async () => {
    await refetch()
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AllTasksRolesList tasks={tasks} onChange={reloadTable} />
        </Suspense>
      </div>
    </main>
  )
}

export default TasksTab
