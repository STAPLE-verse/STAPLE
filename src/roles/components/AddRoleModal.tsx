import { useState } from "react"
import Modal from "src/core/components/Modal"
import { AddRoleForm } from "src/roles/components/AddRoleForm"
import { RoleIdsFormSchema } from "src/roles/schemas"
import { useMultiSelect } from "../../core/components/fields/MultiSelectContext"
import { getCommonRoles } from "../utils/getCommonRoles"
import { useAddRoleContributor } from "../hooks/useAddRoleContributor"

export const AddRoleModal = ({ contributors, projectId, refetch }) => {
  // Handle modal state
  const [openModal, setOpenModal] = useState(false)
  const handleToggleModal = () => {
    setOpenModal((prev) => !prev)
  }

  // Filter the contributors based on selected IDs
  const { selectedIds, resetSelection } = useMultiSelect()
  const selectedContributors = contributors.filter((contributor) =>
    selectedIds.includes(contributor.id)
  )

  // Determine initial roles based on the selected contributors
  const initialRoles = getCommonRoles(selectedContributors)

  const initialValues = {
    rolesId: initialRoles.map((role) => role.id),
  }

  // Handle form submission
  const { handleAddRole } = useAddRoleContributor(refetch)

  const onSubmit = async (values) => {
    const result = await handleAddRole(values, selectedIds)
    if (result === true) {
      resetSelection() // Reset selection if successful
      handleToggleModal() // Close the modal
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleToggleModal}
        disabled={contributors.length < 1 || selectedIds.length < 1}
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
