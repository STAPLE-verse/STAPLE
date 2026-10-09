import { useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import Modal from "src/core/components/Modal"
import copyMilestone from "../mutations/copyMilestone"

type Props = {
  milestoneId: number
  projectId: number
  /** How many tasks the milestone has, so the choice can say what "and tasks" means */
  taskCount: number
}

// Copies the milestone, either on its own or together with its tasks, and opens the copy so it
// can be renamed or adjusted
export const CopyMilestoneButton = ({ milestoneId, projectId, taskCount }: Props) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [copyMilestoneMutation, { isLoading }] = useMutation(copyMilestone)

  const handleCopy = async (includeTasks: boolean) => {
    try {
      const copy = await toast.promise(copyMilestoneMutation({ id: milestoneId, includeTasks }), {
        loading: "Copying milestone...",
        success: includeTasks
          ? "Milestone and tasks copied."
          : "Milestone copied. Its tasks stay with the original.",
        error: "Failed to copy the milestone...",
      })
      setOpen(false)
      await router.push(Routes.ShowMilestonePage({ projectId, milestoneId: copy.id }))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={() => setOpen(true)}>
        Copy Milestone
      </button>
      <Modal open={open} size="w-11/12 max-w-xl">
        <h3 className="text-xl font-bold mb-2">Copy milestone</h3>
        <p className="mb-2">
          The copy keeps this milestone&apos;s name (marked as a copy), description, tags and dates.
        </p>
        <p className="mb-4">
          Tasks can only belong to one milestone, so you can leave them where they are or copy them
          too. Copied tasks are new, unassigned tasks under the copy, with the same details, form
          and roles. Nothing about progress, responses or comments is copied.
        </p>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => void handleCopy(false)}
            disabled={isLoading}
          >
            Copy milestone only
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void handleCopy(true)}
            disabled={isLoading || taskCount === 0}
            title={taskCount === 0 ? "This milestone has no tasks" : undefined}
          >
            {taskCount === 0
              ? "Copy milestone and tasks"
              : `Copy milestone and ${taskCount} task${taskCount === 1 ? "" : "s"}`}
          </button>
        </div>
      </Modal>
    </>
  )
}
