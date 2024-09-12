import { useCallback, useState } from "react"
import { UniqueIdentifier, DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core"
import { DNDType } from "./useTaskBoardData"
import { useMutation } from "@blitzjs/rpc"
import updateTaskOrder from "../mutations/updateTaskOrder"
import handleItemSorting from "../utils/handleItemSorting"
import handleItemDropping from "../utils/handleItemDropping"
import handleContainerSorting from "../utils/handleContainerSorting"
import updateColumnOrder from "../mutations/updateColumnOrder"

interface DragHandlersProps {
  containers: DNDType[]
  updateContainers: (containers: DNDType[]) => void
}

const useDragHandlers = ({ containers, updateContainers }: DragHandlersProps) => {
  // Setup
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [updateTaskOrderMutation] = useMutation(updateTaskOrder)
  const [updateColumnOrderMutation] = useMutation(updateColumnOrder)

  // On drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id)
  }, [])

  // On drag move
  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const { active, over } = event
      let newContainers = [...containers]

      // Handle items sorting
      if (
        active.id.toString().includes("item") &&
        over?.id.toString().includes("item") &&
        active &&
        over &&
        active.id !== over.id
      ) {
        newContainers = handleItemSorting(active.id, over.id, containers)
      }

      // Handling item drop into a container
      if (
        active.id.toString().includes("item") &&
        over?.id.toString().includes("container") &&
        active &&
        over &&
        active.id !== over.id
      ) {
        newContainers = handleItemDropping(active.id, over.id, containers)
      }

      if (newContainers) {
        updateContainers(newContainers)
      }
    },
    [containers, updateContainers]
  )

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      let newContainers = [...containers]

      // Handling Container Sorting
      if (
        active.id.toString().includes("container") &&
        over?.id.toString().includes("container") &&
        active &&
        over &&
        active.id !== over.id
      ) {
        const containerSortingRes = handleContainerSorting(active.id, over.id, containers)

        if (containerSortingRes) {
          newContainers = containerSortingRes.newContainers
          const newColumnOrder = containerSortingRes.newColumnOrder

          await updateColumnOrderMutation({ containerIds: newColumnOrder })

          updateContainers(newContainers)
        }
      } else {
        // Handling item Sorting
        if (
          active.id.toString().includes("item") &&
          over?.id.toString().includes("item") &&
          active &&
          over &&
          active.id !== over.id
        ) {
          newContainers = handleItemSorting(active.id, over.id, containers)
          if (newContainers) updateContainers(newContainers)
        }

        // Handling item dropping into Container
        if (
          active.id.toString().includes("item") &&
          over?.id.toString().includes("container") &&
          active &&
          over &&
          active.id !== over.id
        ) {
          newContainers = handleItemDropping(active.id, over.id, containers)
          if (newContainers) updateContainers(newContainers)
        }

        if (newContainers) {
          const updateTasksList = newContainers.flatMap((container) =>
            container.items.map((item, itemIdx) => ({
              taskId: parseInt(item.id.replace("item-", "")),
              containerId: parseInt(container.id.replace("container-", "")),
              containerTaskOrder: itemIdx,
            }))
          )

          await updateTaskOrderMutation({ tasks: updateTasksList })
        }
      }

      setActiveId(null)
    },
    [containers, updateColumnOrderMutation, updateContainers, updateTaskOrderMutation]
  )

  return {
    activeId,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}

export default useDragHandlers
