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
      {/*@ts-expect-error Suppress missing children error from SortableContext*/}
      <SortableContext items={widgets} strategy={rectSwappingStrategy}>
        {widgets.map((widget) => (
          <div key={widget.id}>
            {/*@ts-expect-error Suppress missing children error from SortableContext*/}
            <SortableWidget id={widget.id} size={widget.size}>
              {widget.component}
            </SortableWidget>
          </div>
        ))}
      </SortableContext>
    </div>
  )
}
