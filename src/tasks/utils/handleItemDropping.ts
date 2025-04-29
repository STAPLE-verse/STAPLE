import { findContainerById, findContainerByItemId } from "../utils/findHelpers"
import { DNDType } from "../hooks/useTaskBoardData"

const handleItemDropping = (
  taskId: number,
  toContainerId: number,
  containers: DNDType[]
): DNDType[] => {
  // Clone the container array deeply enough to modify item arrays
  const newContainers = containers.map((container) => ({
    ...container,
    items: [...container.items],
  }))

  const from = newContainers.find((c) => c.items.some((i) => i.id === taskId))
  const to = newContainers.find((c) => c.id === toContainerId)

  if (!from || !to) return containers

  const itemIdx = from.items.findIndex((i) => i.id === taskId)
  if (itemIdx === -1) return containers

  const [item] = from.items.splice(itemIdx, 1)
  if (!item) return containers
  to.items.push(item)

  return newContainers
}

export default handleItemDropping
