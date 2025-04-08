import { useCallback, useState } from "react"
import { UniqueIdentifier, DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core"
import { DNDType } from "./useTaskBoardData"
import { useMutation } from "@blitzjs/rpc"
import updateTaskOrder from "../mutations/updateTaskOrder"
import handleItemSorting from "../utils/handleItemSorting"
import handleItemDropping from "../utils/handleItemDropping"
import handleContainerSorting from "../utils/handleContainerSorting"
import updateColumnOrder from "../mutations/updateColumnOrder"
import updateTaskStatus from "../mutations/updateTaskStatus"
import { Status } from "db"
import { extractNumericId } from "../utils/extractNumericId"
import toast from "react-hot-toast"

interface DragHandlersProps {
  containers: DNDType[]
  updateContainers: (containers: DNDType[]) => void
}

const useDragHandlers = ({ containers, updateContainers }: DragHandlersProps) => {
  // Setup
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [updateTaskOrderMutation] = useMutation(updateTaskOrder)
  const [updateColumnOrderMutation] = useMutation(updateColumnOrder)
  const [updateTaskStatusMutation] = useMutation(updateTaskStatus)

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

      // test
      console.log("active.item.id", active.id.toString().includes("item"))
      console.log("over.container.id", over?.id.toString().includes("container"))
      console.log("active", active)
      console.log("over", over)
      console.log("is active id not equal over id", active.id !== over!.id)

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

          // Update the task status to completed
          // when the item is dropped into the "done" container
          const taskId = extractNumericId(active.id, "item")
          const targetContainer = containers.find((c) => c.id === over.id)
          const containerTitle = targetContainer?.title

          if (containerTitle?.toLowerCase() === "done" && taskId) {
            await updateTaskStatusMutation({ id: taskId, status: Status.COMPLETED })
            toast.success("Task status change to Completed")
          }
        }

        if (newContainers) {
          const updateTasksList = newContainers.flatMap((container) =>
            container.items.map((item, itemIdx) => ({
              taskId: parseInt(item.id.replace("item-", "")),
              containerId: parseInt(String(container.id).replace("container-", "")),
              containerTaskOrder: itemIdx,
            }))
          )

          await updateTaskOrderMutation({ tasks: updateTasksList })
        }
      }

      setActiveId(null)
    },
    [
      containers,
      updateColumnOrderMutation,
      updateContainers,
      updateTaskOrderMutation,
      updateTaskStatusMutation,
    ]
  )

  return {
    activeId,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}

export default useDragHandlers
