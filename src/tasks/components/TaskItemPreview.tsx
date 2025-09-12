import clsx from "clsx"
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline"

type TaskItemPreviewProps = {
  title: string
  completed: boolean
}

const TaskItemPreview = ({ title, completed }: TaskItemPreviewProps) => {
  return (
    <div
      className={clsx(
        "px-2 py-4 shadow-md rounded-xl w-full border border-transparent",
        completed ? "bg-success" : "bg-accent"
      )}
    >
      <div className="flex items-center justify-between">
        <b className="text-accent-content">{title}</b>
        <div className="flex justify-end items-center">
          <ArrowsPointingOutIcon className="w-6 h-6 text-neutral border-transparent rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default TaskItemPreview
