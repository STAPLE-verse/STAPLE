import { useState } from "react"
import { useAddRoleContributor } from "../hooks/useAddRoleContributor"
import { RoleContributorTable } from "./RoleContributorTable"
import { AddRoleModal } from "./AddRoleModal"

export const AllProjectMemberRolesList = ({ projectMembers, onChange, projectId }) => {
  const roleChanged = async () => {
    if (onChange != undefined) {
      onChange()
    }
  }

  const [selectedIds, setSelectedIds] = useState([] as number[])
  const { handleAddRole } = useAddRoleContributor(onChange)

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

  const initialValues = {
    rolesId: [],
  }

  const hasElements = projectMembers.length < 1 || selectedIds.length < 1

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <RoleContributorTable
        projectMembers={projectMembers}
        selectedIds={selectedIds}
        roleChanged={roleChanged}
        handleMultipleChanged={handleMultipleChanged}
      />

      <div className="modal-action flex justify-end mt-4">
        <button
          type="button"
          /* button for popups */
          className="btn btn-primary"
          onClick={handleToggleEditRoleModal}
          disabled={hasElements}
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
