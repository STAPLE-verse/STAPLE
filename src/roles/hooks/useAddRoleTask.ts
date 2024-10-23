import { useMutation } from "@blitzjs/rpc"
import updateTaskRole from "src/tasks/mutations/updateTaskRole"
import toast from "react-hot-toast"
import { FORM_ERROR } from "final-form"

export const useAddRoleTask = (onChange) => {
  const [updateTaskRoleMutation] = useMutation(updateTaskRole)

  const handleAddRole = async (values, selectedIds, handleToggleEditRoleModal) => {
    try {
      const updated = await updateTaskRoleMutation({
        ...values,
        tasksId: selectedIds,
        disconnect: false,
      })
      await onChange()
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding roles to tasks...",
        success: "Roles added!",
        error: "Failed to add the roles...",
      })
      handleToggleEditRoleModal()
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return { handleAddRole }
}
