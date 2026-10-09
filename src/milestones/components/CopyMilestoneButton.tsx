import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import copyMilestone from "../mutations/copyMilestone"

type Props = {
  milestoneId: number
  projectId: number
}

// Copies the milestone and opens the copy, ready to be renamed or adjusted
export const CopyMilestoneButton = ({ milestoneId, projectId }: Props) => {
  const router = useRouter()
  const [copyMilestoneMutation, { isLoading }] = useMutation(copyMilestone)

  const handleCopy = async () => {
    try {
      const copy = await toast.promise(copyMilestoneMutation({ id: milestoneId }), {
        loading: "Copying milestone...",
        success: "Milestone copied. Its tasks stay with the original.",
        error: "Failed to copy the milestone...",
      })
      await router.push(Routes.ShowMilestonePage({ projectId, milestoneId: copy.id }))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <button type="button" className="btn btn-secondary" onClick={handleCopy} disabled={isLoading}>
      Copy Milestone
    </button>
  )
}
