import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

export const Boxes = ({ id, title, display, link }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card bg-base-300 text-base-content m-2"
    >
      <div className="card-body">
        <div className="card-title text-base-content">{title}</div>
        {display}
      </div>

      <div class="card-actions justify-end">{link}</div>
    </div>
  )
}
