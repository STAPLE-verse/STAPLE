import { useParam } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { FORM_ERROR } from "final-form"
import { useState } from "react"
import toast from "react-hot-toast"
import Modal from "src/core/components/Modal"
import updateTaskRole from "src/tasks/mutations/updateTaskRole"
import { AddRoleForm } from "./AddRoleForm"
import { RoleIdsFormSchema } from "../schemas"

export const AddTaskRolesColumn = ({ row }) => {
  const [updateTaskRoleMutation] = useMutation(updateTaskRole)
  const {
    name = "",
    description = "",
    id = null,
    checked = false,
    onChangeCallback = undefined,
    ...rest
  } = { ...row }

  const projectId = useParam("projectId", "number")
  const [openEditRoleModal, setOpenEditRoleModal] = useState(false)
  const handleToggleEditRoleModal = () => {
    setOpenEditRoleModal((prev) => !prev)
  }

  const rolesId = row.roles ? row.roles.map((role) => role.id) : []
  const initialValues = {
    rolesId: rolesId,
  }

  const handleAddRole = async (values) => {
    try {
      const updated = await updateTaskRoleMutation({
        ...values,
        tasksId: [row.id],
        disconnect: true,
      })
      if (onChangeCallback != undefined) {
        onChangeCallback()
      }
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding Roles to tasks...",
        success: "Roles added!",
        error: "Failed to add the roles...",
      })
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <div className="modal-action flex justify-start mt-4">
      <button
        type="button"
        /* button for popups */
        className="btn btn-primary"
        onClick={handleToggleEditRoleModal}
      >
        Add Role
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
  )
}
