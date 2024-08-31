// dont need size in the second one will fix later: set to null to avoid the warning

import {
  SortableContext,
  verticalListSortingStrategy,
  rectSwappingStrategy,
} from "@dnd-kit/sortable"

import { SortableWidget } from "./SortableWidget"

export const WidgetContainer = ({ widgets }) => {
  return (
    <div className="grid grid-cols-12 justify-center">
      <SortableContext items={widgets} strategy={rectSwappingStrategy}>
        {widgets.map((widget) => (
          <SortableWidget key={widget.id} id={widget.id}>
            {widget.component}
          </SortableWidget>
        ))}
      </SortableContext>
    </div>
  )
}

// export const SortableProjectBox = ({ boxes }) => {
//   return (
//     <div className="justify-center">
//       <SortableContext items={boxes} strategy={rectSwappingStrategy}>
//         {boxes.map((boxes) => (
//           <Boxes
//             size={null}
//             key={boxes.id}
//             id={boxes.id}
//             title={boxes.title}
//             display={boxes.display}
//             link={boxes.link}
//             tooltipId={boxes.tooltipId}
//             tooltipContent={boxes.tooltipContent}
//           />
//         ))}
//       </SortableContext>
//     </div>
//   )
// }
