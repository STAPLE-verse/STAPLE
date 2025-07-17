import { arrayMove } from "@dnd-kit/sortable"
import { DNDType } from "../hooks/useTaskBoardData"
import { findContainerByItemId } from "../utils/findHelpers"

const handleItemSorting = (
  taskId: number,
  overTaskId: number,
  containers: DNDType[]
): DNDType[] => {
  const newContainers = containers.map((container) => ({
    ...container,
    items: [...container.items],
  }))

  const fromContainer = findContainerByItemId(taskId, newContainers)
  const toContainer = findContainerByItemId(overTaskId, newContainers)

  if (!fromContainer || !toContainer) return containers

  const fromItemIdx = fromContainer.items.findIndex((item) => item.id === taskId)
  const toItemIdx = toContainer.items.findIndex((item) => item.id === overTaskId)

  if (fromItemIdx === -1 || toItemIdx === -1) return containers

  if (fromContainer.id === toContainer.id) {
    fromContainer.items = arrayMove(fromContainer.items, fromItemIdx, toItemIdx)
  } else {
    const [movedItem] = fromContainer.items.splice(fromItemIdx, 1)
    if (!movedItem) return containers
    toContainer.items.splice(toItemIdx, 0, movedItem)
  }

  return newContainers
}

export default handleItemSorting
