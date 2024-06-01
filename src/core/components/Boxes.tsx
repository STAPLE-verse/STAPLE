import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Tooltip } from "react-tooltip"

export const Boxes = ({ id, title, display, link, size, tooltipId, tooltipContent }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const classname = `card bg-base-300 text-base-content m-2 ${size}`

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={classname}>
      <div className="card-body">
        <div className="card-title text-base-content" data-tooltip-id={tooltipId}>
          {title}
        </div>
        {display}
      </div>
      <Tooltip id={tooltipId} content={tooltipContent} className="z-[1099]" />

      <div className="card-actions justify-end">{link}</div>
    </div>
  )
}
