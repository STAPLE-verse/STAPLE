import { useState } from "react"
import Modal from "src/core/components/Modal"
import { AddRoleForm } from "src/roles/components/AddRoleForm"
import { RoleIdsFormSchema } from "src/roles/schemas"
import { useMultiSelect } from "../../core/components/fields/MultiSelectContext"
import { getCommonRoles } from "../utils/getCommonRoles"
import { useAddRoleContributor } from "../hooks/useAddRoleContributor"
import { useAddRoleTask } from "../hooks/useAddRoleTask"

export const AddRoleModal = ({ rows, projectId, refetch, type }) => {
  // Handle modal state
  const [openModal, setOpenModal] = useState(false)
  const handleToggleModal = () => {
    setOpenModal((prev) => {
      if (prev) {
        resetSelection() // Reset the checkboxes if the modal is being closed
      }
      return !prev
    })
  }

  // Filter the contributors based on selected IDs
  const { selectedIds, resetSelection } = useMultiSelect()
  const selectedRows = rows.filter((row) => selectedIds.includes(row.id))

  // Determine initial roles based on the selected contributors
  const initialRoles = getCommonRoles(selectedRows)

  const initialValues = {
    rolesId: initialRoles.map((role) => role.id),
  }

  // Handle form submission
  // Call both hooks unconditionally
  const { handleAddRole: handleAddContributorRole } = useAddRoleContributor(refetch)
  const { handleAddRole: handleAddTaskRole } = useAddRoleTask(refetch)

  // Select the appropriate handler based on roleType
  const handleAddRole = type === "contributor" ? handleAddContributorRole : handleAddTaskRole

  const onSubmit = async (values) => {
    const result = await handleAddRole(values, selectedIds)
    if (result === true) {
      handleToggleModal() // Close the modal
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleToggleModal}
        disabled={rows.length < 1 || selectedIds.length < 1}
      >
        Add Role
      </button>
      <Modal open={openModal} size="w-7/8 max-w-xl">
        <div className="">
          <h1 className="flex justify-center mb-2 text-3xl">Add Roles</h1>
          <div className="flex justify-start mt-4">
            <AddRoleForm
              projectId={projectId}
              schema={RoleIdsFormSchema}
              submitText="Update Role"
              className="flex flex-col"
              onSubmit={onSubmit}
              initialValues={initialValues}
            />
          </div>
          <div className="modal-action flex justify-end mt-4">
            <button type="button" className="btn btn-secondary" onClick={handleToggleModal}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
