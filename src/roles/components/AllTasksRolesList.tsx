import { useState } from "react"
import { RoleTaskTable } from "./RoleTaskTable"
import { AddRoleModal } from "./AddRoleModal"
import { useAddRoleTask } from "../hooks/useAddRoleTask"

export const AllTasksRolesList = ({ tasks, onChange, projectId }) => {
  const [selectedIds, setSelectedIds] = useState([] as number[])
  const { handleAddRole } = useAddRoleTask(onChange)

  const [openEditRoleModal, setOpenEditRoleModal] = useState(false)
  const handleToggleEditRoleModal = () => {
    setOpenEditRoleModal((prev) => !prev)
  }

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

  const initialValues = {
    rolesId: [],
  }

  const hasElements = tasks.length < 1 || selectedIds.length < 1

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <RoleTaskTable
        tasks={tasks}
        selectedIds={selectedIds}
        roleChanged={roleChanged}
        handleMultipleChanged={handleMultipleChanged}
      />

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

        <AddRoleModal
          openEditRoleModal={openEditRoleModal}
          handleToggleEditRoleModal={handleToggleEditRoleModal}
          handleAddRole={(values) => handleAddRole(values, selectedIds, handleToggleEditRoleModal)}
          initialValues={initialValues}
          projectId={projectId}
        />
      </div>
    </main>
  )
}
