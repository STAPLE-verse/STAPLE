import { useMutation } from "@blitzjs/rpc"
import toast from "react-hot-toast"
import { FORM_ERROR } from "final-form"
import updateProjectMemberRole from "src/projectmembers/mutations/updateProjectMemberRole"

export const useAddRoleContributor = (onChange) => {
  const [updateProjectMemberRoleMutation] = useMutation(updateProjectMemberRole)

  const handleAddRole = async (values, selectedIds, handleToggleEditRoleModal) => {
    try {
      const updated = await updateProjectMemberRoleMutation({
        ...values,
        projectMembersId: selectedIds,
        disconnect: false,
      })
      await onChange()
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding roles to contributors...",
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
