import {
  SortableContext,
  verticalListSortingStrategy,
  rectSwappingStrategy,
} from "@dnd-kit/sortable"

import { SortableWidget } from "./SortableWidget"
import { ConstructedWidget } from "../hooks/useWidgetConstruction"

interface WidgetContainerProps {
  widgets: ConstructedWidget[]
}

export const WidgetContainer = ({ widgets }: WidgetContainerProps) => {
  return (
    <div className="grid gap-4 w-full grid-cols-2 sm:grid-cols-2 lg:grid-cols-8 auto-rows-auto">
      <SortableContext items={widgets} strategy={rectSwappingStrategy}>
        {widgets.map((widget) => (
          <SortableWidget key={widget.id} id={widget.id} size={widget.size}>
            {widget.component}
          </SortableWidget>
        ))}
      </SortableContext>
    </div>
  )
}
