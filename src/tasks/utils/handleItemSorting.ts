import { arrayMove } from "@dnd-kit/sortable"
import { findValueOfItems } from "../utils/findHelpers"
import { DNDType } from "../hooks/useTaskBoardData"
import { UniqueIdentifier } from "@dnd-kit/core"

const handleItemSorting = (
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  containers: DNDType[]
): DNDType[] => {
  // Validation
  // if (!activeId || !overId) {
  //   console.error("Active or Over item is undefined")
  //   return
  // }

  // if (!activeId.toString().includes("item") &&
  //   !overId?.toString().includes("item")) {
  //   console.error("Ids do not belong to sortable items.")
  //   return
  // }

  let newContainers = [...containers]
  const activeContainer = findValueOfItems(activeId, "item", containers)
  const overContainer = findValueOfItems(overId, "item", containers)

  // if (!activeContainer || !overContainer) {
  //   console.error("Active or Over container not found")
  //   return
  // }

  // Find the index of the active and over container
  const activeContainerIndex = containers.findIndex(
    (container) => container.id === activeContainer!.id
  )
  const overContainerIndex = containers.findIndex((container) => container.id === overContainer!.id)
  // Find the index of the active and over item
  const activeitemIndex = activeContainer!.items.findIndex((item) => item.id === activeId)
  const overitemIndex = overContainer!.items.findIndex((item) => item.id === overId)

  // In the same container
  if (activeContainerIndex === overContainerIndex) {
    newContainers[activeContainerIndex]!.items = arrayMove(
      newContainers[activeContainerIndex]!.items,
      activeitemIndex,
      overitemIndex
    )
    // In different containers
  } else {
    const [removeditem] = newContainers[activeContainerIndex]!.items.splice(activeitemIndex, 1)
    newContainers[overContainerIndex]!.items.splice(overitemIndex, 0, removeditem!)
  }

  // Return updated state
  return newContainers
}

export default handleItemSorting
