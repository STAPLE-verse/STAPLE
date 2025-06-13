// TaskContainerPreview.tsx
import clsx from "clsx"
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline"
import TaskItemPreview from "./TaskItemPreview"

type TaskContainerPreviewProps = {
  title: string
  items?: { id: number; title: string; completed: boolean }[]
}

const TaskContainerPreview = ({ title, items = [] }: TaskContainerPreviewProps) => {
  return (
    <div
      className={clsx(
        "w-full h-full p-4 bg-base-300 rounded-xl flex flex-col gap-y-4 border border-dashed border-neutral"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h2 className="font-bold text-lg">{title}</h2>
        </div>
        <ArrowsPointingOutIcon className="w-6 h-6 text-base-content border-transparent rounded-2xl" />
      </div>

      <div className="flex flex-col gap-y-2">
        {items.map((item) => (
          // @ts-ignore: suppress key error, can't change key assignment
          <TaskItemPreview key={item.id} title={item.title} completed={item.completed} />
        ))}
      </div>
    </div>
  )
}

export default TaskContainerPreview
