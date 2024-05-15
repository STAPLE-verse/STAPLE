import {
  SortableContext,
  verticalListSortingStrategy,
  rectSwappingStrategy,
} from "@dnd-kit/sortable"

import { Boxes } from "src/core/components/Boxes"

export const SortableBox = ({ widgets }) => {
  // console.log(widgets)
  return (
    <div className="grid grid-cols-2 justify-center">
      <SortableContext items={widgets.map((widget) => widget.id)} strategy={rectSwappingStrategy}>
        {widgets.map(({ id, Component, props }) => (
          <Boxes key={id} id={id}>
            <Component {...props} />
          </Boxes>
        ))}
      </SortableContext>
    </div>
  )
}
