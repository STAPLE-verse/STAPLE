import { arrayMove } from "@dnd-kit/sortable"
import { DNDType } from "../hooks/useTaskBoardData"

const handleContainerSorting = (
  activeId: number,
  overId: number,
  containers: DNDType[]
): { newContainers: DNDType[]; newColumnOrder: number[] } | undefined => {
  // Create shallow copy of containers array
  const newContainers = [...containers]

  // Find indices of the containers to reorder
  const fromIdx = newContainers.findIndex((container) => container.id === activeId)
  const toIdx = newContainers.findIndex((container) => container.id === overId)

  if (fromIdx === -1 || toIdx === -1) return undefined

  const reordered = arrayMove(newContainers, fromIdx, toIdx)

  const newColumnOrder = reordered.map((container) => container.id)

  return { newContainers: reordered, newColumnOrder }
}

export default handleContainerSorting
