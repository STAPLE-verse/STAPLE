import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { WidgetSize } from "@prisma/client"

export const SortableWidget = ({ id, children, size }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const gridColumnClass =
    size === WidgetSize.SMALL
      ? "col-span-2"
      : size === WidgetSize.LARGE
      ? "col-span-6"
      : "col-span-4"

  const gridRowClass =
    size === WidgetSize.LARGE
      ? "row-span-4"
      : size === WidgetSize.SMALL
      ? "row-span-1"
      : "row-span-2"

  const classname = `card bg-base-300 text-base-content overflow-hidden ${gridColumnClass} ${gridRowClass}`

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={classname}>
      {children}
    </div>
  )
}
