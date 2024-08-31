import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export const Boxes = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const classname = `card bg-base-300 text-base-content m-2`

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={classname}>
      {children}
    </div>
  )
}
