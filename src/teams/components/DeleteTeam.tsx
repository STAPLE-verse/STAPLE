import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import deleteTeam from "../mutations/deleteTeam"
import { TeamWithUsers } from "src/core/types"

interface DeleteTeamProps {
  team: TeamWithUsers
}

const DeleteTeam = ({ team }: DeleteTeamProps) => {
  const [deleteTeamMutation] = useMutation(deleteTeam)
  const router = useRouter()

  const handleDelete = async () => {
    if (window.confirm("The team will be permanently deleted. Are you sure to continue?")) {
      await deleteTeamMutation({ id: team.id })
      await router.push(Routes.TeamsPage({ projectId: team.projectId }))
    }
  }

  return (
    <button className="btn btn-warning" onClick={handleDelete}>
      Delete Team
    </button>
  )
}

export default DeleteTeam
