import { useCallback, useRef, useState } from "react"
import { DragStartEvent, DragMoveEvent, DragEndEvent } from "@dnd-kit/core"
import { useMutation } from "@blitzjs/rpc"
import toast from "react-hot-toast"

import updateTaskOrder from "../mutations/updateTaskOrder"
import updateColumnOrder from "../mutations/updateColumnOrder"
import updateTaskStatus from "../mutations/updateTaskStatus"

import handleItemSorting from "../utils/handleItemSorting"
import handleItemDropping from "../utils/handleItemDropping"
import handleContainerSorting from "../utils/handleContainerSorting"
import { DNDType } from "./useTaskBoardData"
import { Status } from "db"
import { parseDragId } from "../utils/dragId"

interface DragHandlersProps {
  containers: DNDType[]
  updateContainers: (containers: DNDType[]) => void
  refetch: () => void
}

export type DragItemData =
  | { type: "item"; taskId: number; columnId: number }
  | { type: "container"; columnId: number }

const useDragHandlers = ({ containers, updateContainers, refetch }: DragHandlersProps) => {
  const [activeData, setActiveData] = useState<DragItemData | null>(null)
  const [updateTaskOrderMutation] = useMutation(updateTaskOrder)
  const [updateColumnOrderMutation] = useMutation(updateColumnOrder)
  const [updateTaskStatusMutation] = useMutation(updateTaskStatus)
  const lastOverId = useRef<string | null>(null)

  // DRAG START
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveData(event.active.data.current as DragItemData)
  }, [])

  // DRAG MOVE — used only for visual feedback
  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const { active, over } = event

      if (!over || active.id === over.id) return

      if (over?.id) {
        lastOverId.current = String(over.id)
      }

      const activeParsed = parseDragId(String(active.id))
      const overParsed = parseDragId(String(over.id))
      if (!activeParsed || !overParsed) return

      let newContainers = containers.map((c) => ({
        ...c,
        items: [...c.items],
      }))

      // ↕ Container sorting
      if (activeParsed.type === "container" && overParsed.type === "container") {
        const result = handleContainerSorting(activeParsed.id, overParsed.id, newContainers)
        if (result) {
          newContainers = result.newContainers
        }
      }

      // Item sorting (same container)
      if (activeParsed.type === "item" && overParsed.type === "item") {
        newContainers = handleItemSorting(activeParsed.id, overParsed.id, newContainers)
      }

      // ↔ Item dropping into empty container
      if (activeParsed.type === "item" && overParsed.type === "container") {
        newContainers = handleItemDropping(activeParsed.id, overParsed.id, newContainers)
      }

      updateContainers(newContainers)
    },
    [containers, updateContainers]
  )

  // DRAG END — handles persistence
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active } = event
      const overId = lastOverId.current

      if (!overId || active.id === overId || !activeData) return

      const overParsed = parseDragId(String(overId))
      if (!overParsed) return

      let refetchNeeded = false

      // Persist new column order if we moved containers
      if (activeData.type === "container" && overParsed.type === "container") {
        const newColumnOrder = containers.map((c) => c.id)
        await updateColumnOrderMutation({ containerIds: newColumnOrder })
        refetchNeeded = true
      }

      // Persist new task order always
      const updatePayload = containers.flatMap((container) =>
        container.items.map((item, idx) => ({
          taskId: item.id,
          containerId: container.id,
          containerTaskOrder: idx,
        }))
      )

      if (updatePayload.length > 0) {
        await updateTaskOrderMutation({ tasks: updatePayload })
        refetchNeeded = true
      }

      // Check for completion status
      if (activeData.type === "item") {
        // Find the container that now contains the item
        const container = containers.find((c) =>
          c.items.some((item) => item.id === activeData.taskId)
        )

        const isDone = container?.title.trim().toLowerCase() === "done"

        if (isDone) {
          await updateTaskStatusMutation({
            id: activeData.taskId,
            status: Status.COMPLETED,
          })
          toast.success("Task marked as completed")
          refetchNeeded = true
        }
      }

      if (refetchNeeded) {
        await refetch()
      }

      setActiveData(null)
    },
    [
      activeData,
      containers,
      updateColumnOrderMutation,
      updateTaskOrderMutation,
      updateTaskStatusMutation,
      refetch,
    ]
  )

  return {
    activeData,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}

export default useDragHandlers
