import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import deleteProjectMember from "src/projectmembers/mutations/deleteProjectMember"
import toast from "react-hot-toast"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { ProjectMemberWithUsers } from "src/core/types"

interface DeleteContributorProps {
  contributor: ProjectMemberWithUsers
}

const DeleteContributor = ({ contributor }: DeleteContributorProps) => {
  const [deleteProjectMemberMutation] = useMutation(deleteProjectMember)
  const router = useRouter()

  const currentUser = useCurrentUser()
  const projectId = contributor.projectId
  const contributorUser = contributor?.users[0]

  const handleDelete = async () => {
    if (
      window.confirm("This Contributor will be removed from the project. Are you sure to continue?")
    ) {
      try {
        await deleteProjectMemberMutation({ id: contributor.id })

        // Navigate based on whether the current user was deleted
        if (contributorUser?.id === currentUser?.id) {
          await router.push(Routes.ProjectsPage())
        } else {
          await router.push(Routes.ContributorsPage({ projectId }))
        }

        toast.success("Contributor successfully removed")
      } catch (error) {
        toast.error("Failed to delete contributor: " + error.message)
      }
    }
  }

  return (
    <button className="btn btn-secondary mt-4" onClick={handleDelete}>
      Delete Contributor
    </button>
  )
}

export default DeleteContributor
