import { useMutation } from "@blitzjs/rpc"
import updateRole from "../mutations/updateRole"
import toast from "react-hot-toast"
import { FORM_ERROR } from "final-form"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import Modal from "src/core/components/Modal"
import { useState } from "react"
import { RoleForm } from "./RoleForm"
import { RoleFormSchema } from "../schemas"

interface EditRoleProps {
  id: number
  name: string
  description: string
  taxonomy: string
  userId: number
  taxonomyList: string[]
  onRolesChanged?: () => void
}

export const EditRole = ({
  id,
  name,
  description,
  taxonomy,
  userId,
  taxonomyList,
  onRolesChanged,
}: EditRoleProps) => {
  const [updateRoleMutation] = useMutation(updateRole)
  const [openEditRoleModal, setOpenEditRoleModal] = useState(false)

  // Handle events
  const handleToggleEditRoleModal = () => {
    setOpenEditRoleModal((prev) => !prev)
  }

  const handleEditRole = async (values) => {
    try {
      const updated = await updateRoleMutation({
        ...values,
        userId: userId,
        id: id,
      })

      if (onRolesChanged) {
        onRolesChanged()
      }

      await toast.promise(Promise.resolve(updated), {
        loading: "Editing role...",
        success: "Role edited!",
        error: "Failed to edit the role...",
      })

      handleToggleEditRoleModal()
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <div>
      <button type="button" className="btn btn-ghost" onClick={handleToggleEditRoleModal}>
        <PencilSquareIcon width={25} className="stroke-primary" />
      </button>
      <Modal open={openEditRoleModal} size="w-1/3 max-w-1/2">
        <div className="">
          <h1 className="flex justify-center mb-2 text-3xl">Edit Role</h1>
          <div className="flex justify-start mt-4">
            <RoleForm
              schema={RoleFormSchema}
              submitText="Update Role"
              className="flex flex-col w-full"
              onSubmit={handleEditRole}
              initialValues={{ name, description, taxonomy }}
              taxonomyList={taxonomyList}
            ></RoleForm>
          </div>

          {/* closes the modal */}
          <div className="modal-action flex justify-end mt-4">
            <button type="button" className="btn btn-secondary" onClick={handleToggleEditRoleModal}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
