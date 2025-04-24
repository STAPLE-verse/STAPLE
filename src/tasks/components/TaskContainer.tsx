import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsUpDownLeftRight } from "@fortawesome/free-solid-svg-icons"
import DeleteColumn from "./DeleteColumn"
import EditableColumnTitle from "./EditableColumnTitle"
import { makeDragId } from "../utils/dragId"

interface ContainerProps {
  id: number
  children: React.ReactNode
  title?: string
  description?: string
  onRefetch?: () => void
}

const TaskContainer = ({ id, children, title, description, onRefetch }: ContainerProps) => {
  const { attributes, setNodeRef, listeners, transform, transition, isDragging } = useSortable({
    id: makeDragId("container", id),
    data: {
      type: "container",
      columnId: id,
    },
  })

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "w-full h-full p-4 bg-base-300 rounded-xl flex flex-col gap-y-4 hover:border-accent-content cursor-pointer",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <EditableColumnTitle
            columnId={id}
            initialTitle={title ?? ""}
            isEditable={title !== "Done"}
            onRefetch={onRefetch}
          />
          <p className="text-base">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {title !== "Done" && title !== undefined && (
            <DeleteColumn columnId={id} columnName={title} />
          )}

          <FontAwesomeIcon
            icon={faArrowsUpDownLeftRight}
            className="w-6 h-6 text-base-content border-transparent rounded-2xl hover:opacity-50 draggable"
            {...listeners}
          />
        </div>
      </div>

      {children}
    </div>
  )
}

export default TaskContainer
