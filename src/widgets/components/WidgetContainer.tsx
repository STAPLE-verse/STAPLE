import { SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable"

import { SortableWidget } from "./SortableWidget"
import { ConstructedWidget } from "../hooks/useWidgetConstruction"

interface WidgetContainerProps {
  widgets: ConstructedWidget[]
}

export const WidgetContainer = ({ widgets }: WidgetContainerProps) => {
  //console.log(widgets)
  return (
    <div className="grid gap-4 w-full grid-cols-12 lg:grid-cols-12 auto-rows-auto">
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
