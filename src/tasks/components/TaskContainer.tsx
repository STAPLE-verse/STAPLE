import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsUpDownLeftRight } from "@fortawesome/free-solid-svg-icons"
import { UniqueIdentifier } from "@dnd-kit/core"
import DeleteColumn from "./DeleteColumn"
import { extractNumericId } from "../utils/extractNumericId"
import EditableColumnTitle from "./EditableColumnTitle"

interface ContainerProps {
  id: UniqueIdentifier
  children: React.ReactNode
  title?: string
  description?: string
  onRefetch?: () => void
}

const TaskContainer = ({ id, children, title, description, onRefetch }: ContainerProps) => {
  const columnId = extractNumericId(id, "container")
  const { attributes, setNodeRef, listeners, transform, transition, isDragging } = useSortable({
    id: id,
    data: {
      type: "container",
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
            columnId={columnId!}
            initialTitle={title ?? ""}
            isEditable={title !== "Done"}
            onRefetch={onRefetch}
          />
          <p className="text-base">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {title !== "Done" && columnId !== undefined && title !== undefined && (
            <DeleteColumn columnId={columnId} columnName={title} />
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
