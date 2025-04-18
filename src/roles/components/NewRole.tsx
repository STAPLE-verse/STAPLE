import { useMutation } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import createRole from "../mutations/createRole"
import { useState } from "react"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import Modal from "src/core/components/Modal"
import { RoleForm } from "./RoleForm"
import { RoleFormSchema } from "../schemas"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

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
          className="btn btn-primary"
          onClick={() => handleToggleNewRoleModal()}
        >
          New Role
        </button>
      </div>

      <Modal open={openNewRoleModal} size="w-1/3 max-w-1/2">
        <div className="">
          <h1 className="flex justify-center items-center mb-2 text-3xl">
            Create New Role
            <InformationCircleIcon
              className="h-6 w-6 ml-2 text-info stroke-2"
              data-tooltip-id="add-role"
            />
            <Tooltip
              id="add-role"
              content="Roles describe what each person did in a project—like data collection or project management. You can create your own roles and use them across any project. The 'system' should be the name of the role classification system you're using (e.g., CRediT, custom, etc.)."
              className="z-[1099] ourtooltips"
            />
          </h1>
          <div className="flex justify-start mt-4">
            <RoleForm
              schema={RoleFormSchema}
              submitText="Create Role"
              className="flex flex-col w-full"
              onSubmit={handleNewRole}
              taxonomyList={taxonomyList}
              cancelText={"Cancel"}
              onCancel={handleToggleNewRoleModal}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
