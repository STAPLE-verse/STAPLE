import { useMutation } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import createRole from "../mutations/createRole"
import { useState } from "react"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import Modal from "src/core/components/Modal"
import { RoleForm } from "./RoleForm"
import { RoleFormSchema } from "../schemas"

interface NewRoleProps {
  taxonomyList: string[]
  onRolesChanged?: () => void
}

export const NewRole = ({ taxonomyList, onRolesChanged }: NewRoleProps) => {
  const [createRoleMutation] = useMutation(createRole)
  const currentUser = useCurrentUser()
  const [openNewRoleModal, setOpenNewRoleModal] = useState(false)

  // Handle events
  const handleToggleNewRoleModal = () => {
    setOpenNewRoleModal((prev) => !prev)
  }

  const handleNewRole = async (values) => {
    try {
      const role = await createRoleMutation({
        name: values.name,
        description: values.description,
        userId: currentUser!.id,
        taxonomy: values.taxonomy,
      })

      if (onRolesChanged) {
        onRolesChanged()
      }

      await toast.promise(Promise.resolve(role), {
        loading: "Creating role...",
        success: "Role created!",
        error: "Failed to create the role...",
      })

      handleToggleNewRoleModal()
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <>
      <div>
        <button
          type="button"
          className="btn btn-primary mt-4"
          onClick={() => handleToggleNewRoleModal()}
        >
          New Role
        </button>
      </div>

      <Modal open={openNewRoleModal} size="w-1/3 max-w-1/2">
        <div className="">
          <h1 className="flex justify-center mb-2 text-3xl">Create New Role</h1>
          <div className="flex justify-start mt-4">
            <RoleForm
              schema={RoleFormSchema}
              submitText="Create Role"
              className="flex flex-col w-full"
              onSubmit={handleNewRole}
              taxonomyList={taxonomyList}
            />
          </div>

          {/* closes the modal */}
          <div className="modal-action flex justify-end mt-4">
            <button type="button" className="btn btn-secondary" onClick={handleToggleNewRoleModal}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
