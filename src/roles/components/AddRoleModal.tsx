import Modal from "src/core/components/Modal"
import { AddRoleForm } from "src/roles/components/AddRoleForm"
import { RoleIdsFormSchema } from "src/roles/schemas"

export const AddRoleModal = ({
  openEditRoleModal,
  handleToggleEditRoleModal,
  handleAddRole,
  initialValues,
  projectId,
}) => (
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
        />
      </div>
      <div className="modal-action flex justify-end mt-4">
        <button type="button" className="btn btn-secondary" onClick={handleToggleEditRoleModal}>
          Close
        </button>
      </div>
    </div>
  </Modal>
)
