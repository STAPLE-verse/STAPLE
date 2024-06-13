import { findValueOfItems } from "../utils/findHelpers"
import { DNDType } from "../hooks/useTaskBoardData"
import { UniqueIdentifier } from "@dnd-kit/core"

const handleItemDropping = (
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  containers: DNDType[]
): DNDType[] => {
  // Setup
  const newContainers = [...containers]

  // Validation
  // if (!activeId || !overId) {
  //   console.error("Active or Over item is undefined")
  //   return
  // }

  // if (!activeId.toString().includes("item") &&
  //   !overId?.toString().includes("container")) {
  //   console.error("activeId must belong to an item and overId must belong to a container")
  //   return
  // }

  // if (activeId !== overId) {
  //   console.error("activeId must not be equal to overId")
  //   return
  // }

  // Find the active and over container
  const activeContainer = findValueOfItems(activeId, "item", containers)
  const overContainer = findValueOfItems(overId, "container", containers)

  // if (!activeContainer || !overContainer) {
  //   console.error("Active or Over container not found")
  //   return
  // }

  // If the active or over container is not found, return
  // if (!activeContainer || !overContainer) return

  // Find the index of the active and over container
  const activeContainerIndex = containers.findIndex(
    (container) => container.id === activeContainer!.id
  )
  const overContainerIndex = containers.findIndex((container) => container.id === overContainer!.id)
  // Find the index of the active and over item
  const activeitemIndex = activeContainer!.items.findIndex((item) => item.id === activeId)

  const [removeditem] = newContainers[activeContainerIndex]!.items.splice(activeitemIndex, 1)
  newContainers[overContainerIndex]!.items.push(removeditem!)

  // Return updated state
  return newContainers
}

export default handleItemDropping
