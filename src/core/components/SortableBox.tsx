import {
  SortableContext,
  verticalListSortingStrategy,
  rectSwappingStrategy,
} from "@dnd-kit/sortable"

import { Boxes } from "src/core/components/Boxes"

export const SortableBox = ({ boxes }) => {
  return (
    <div className="grid grid-cols-12 justify-center">
      <SortableContext items={boxes} strategy={rectSwappingStrategy}>
        {boxes.map((boxes) => (
          <Boxes
            key={boxes.id}
            id={boxes.id}
            title={boxes.title}
            display={boxes.display}
            link={boxes.link}
            size={boxes.size}
            tooltipId={boxes.tooltipId}
            tooltipContent={boxes.tooltipContent}
          />
        ))}
      </SortableContext>
    </div>
  )
}

export const SortableProjectBox = ({ boxes }) => {
  return (
    <div className="justify-center">
      <SortableContext items={boxes} strategy={rectSwappingStrategy}>
        {boxes.map((boxes) => (
          <Boxes
            key={boxes.id}
            id={boxes.id}
            title={boxes.title}
            display={boxes.display}
            link={boxes.link}
            tooltipId={boxes.tooltipId}
            tooltipContent={boxes.tooltipContent}
          />
        ))}
      </SortableContext>
    </div>
  )
}
