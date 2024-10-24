import { useMutation } from "@blitzjs/rpc"
import toast from "react-hot-toast"
import { FORM_ERROR } from "final-form"
import updateProjectMemberRole from "src/projectmembers/mutations/updateProjectMemberRole"

export const useAddRoleContributor = (refetch) => {
  const [updateProjectMemberRoleMutation] = useMutation(updateProjectMemberRole)

  const handleAddRole = async (values, selectedIds) => {
    try {
      const updated = await updateProjectMemberRoleMutation({
        rolesId: values.rolesId,
        projectMembersId: selectedIds,
        disconnect: true,
      })
      await refetch()
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding roles to contributors...",
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
