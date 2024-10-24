import { useMutation } from "@blitzjs/rpc"
import updateTaskRole from "src/tasks/mutations/updateTaskRole"
import toast from "react-hot-toast"
import { FORM_ERROR } from "final-form"

export const useAddRoleTask = (refetch) => {
  const [updateTaskRoleMutation] = useMutation(updateTaskRole)

  const handleAddRole = async (values, selectedIds) => {
    try {
      const updated = await updateTaskRoleMutation({
        rolesId: values.rolesId,
        tasksId: selectedIds,
        disconnect: true,
      })
      await refetch()
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding roles to tasks...",
        success: "Roles added!",
        error: "Failed to add the roles...",
      })

      return true
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return { handleAddRole }
}
