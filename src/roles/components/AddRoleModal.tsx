import { useState } from "react"
import Modal from "src/core/components/Modal"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
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
        <div>
          <h1 className="flex justify-center items-center gap-2 mb-2 text-3xl">
            Add Roles
            <InformationCircleIcon
              className="h-6 w-6 stroke-2 text-info"
              data-tooltip-id="add-roles-tooltip"
            />
            <Tooltip
              id="add-roles-tooltip"
              content="You can add roles to contributors or tasks. The name of the project manager who defined the role is listed to help you choose the most relevant ones."
              className="z-[1099] ourtooltips"
            />
          </h1>
          <div className="flex justify-start mt-4">
            <AddRoleForm
              projectId={projectId}
              schema={RoleIdsFormSchema}
              submitText="Update Role"
              cancelText="Close"
              className="flex flex-col w-full"
              onSubmit={onSubmit}
              initialValues={initialValues}
              onCancel={handleToggleModal}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
