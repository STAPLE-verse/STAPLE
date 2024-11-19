import { arrayMove } from "@dnd-kit/sortable"
import { DNDType } from "../hooks/useTaskBoardData"
import { UniqueIdentifier } from "@dnd-kit/core"

const handleContainerSorting = (
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  containers: DNDType[]
): { newContainers: DNDType[]; newColumnOrder: number[] } | undefined => {
  // Setup
  let newContainers = [...containers]

  // Validation
  // if (!activeId || !overId) {
  //   console.error("Active or Over item is undefined")
  //   return
  // }

  // if (!activeId.toString().includes("container") &&
  //   !overId?.toString().includes("container")) {
  //   console.error("Ids do not belong to sortable containers.")
  //   return
  // }

  // if (activeId !== overId) {
  //   console.error("activeId must not be equal to overId")
  //   return
  // }

  // Find the index of the active and over container
  const activeContainerIndex = containers.findIndex((container) => container.id === activeId)
  const overContainerIndex = containers.findIndex((container) => container.id === overId)
  // if (!activeContainerIndex || !overContainerIndex) {
  //   console.error("Active or Over container indexes are not found")
  //   return
  // }
  // Swap the active and over container
  newContainers = arrayMove(newContainers, activeContainerIndex, overContainerIndex)

  // Update column order
  const newColumnOrder = newContainers.map((container) =>
    parseInt(String(container.id).replace("container-", ""))
  )

  // Return updated state
  return { newContainers: newContainers, newColumnOrder: newColumnOrder }
}

export default handleContainerSorting
