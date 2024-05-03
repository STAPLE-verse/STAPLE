import {
  SortableContext,
  verticalListSortingStrategy,
  rectSwappingStrategy,
} from "@dnd-kit/sortable"

import { Boxes } from "src/core/components/Boxes.tsx"

export const SortableBox = ({ boxes }) => {
  return (
    <div className="grid grid-cols-2 justify-center">
      <SortableContext items={boxes} strategy={rectSwappingStrategy}>
        {boxes.map((boxes) => (
          <Boxes
            key={boxes.id}
            id={boxes.id}
            title={boxes.title}
            display={boxes.display}
            link={boxes.link}
          />
        ))}
      </SortableContext>
    </div>
  )
}
