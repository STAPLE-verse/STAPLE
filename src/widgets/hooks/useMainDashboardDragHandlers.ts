import { useCallback } from "react"
import { DragEndEvent } from "@dnd-kit/core"
import { useMutation } from "@blitzjs/rpc"
import { arrayMove } from "@dnd-kit/sortable"
import updateWidget from "../mutations/updateWidget"
import { WidgetObject } from "../utils/constructWidget"

interface DragHandlersProps {
  setBoxes: React.Dispatch<React.SetStateAction<WidgetObject[]>>
}

const useMainDashboardDragHandlers = ({ setBoxes }: DragHandlersProps) => {
  // Setup
  const [updateWidgetMutation] = useMutation(updateWidget)

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        setBoxes((boxes) => {
          const oldIndex = boxes.findIndex((box) => box.id === active.id)
          const newIndex = boxes.findIndex((box) => box.id === over.id)
          const newBoxes = arrayMove(boxes, oldIndex, newIndex)

          // Update positions based on new order in the state
          const updatedPositions = newBoxes.map((box, index) => ({
            id: box.id,
            position: index + 1,
          }))

          // Call the mutation
          updateWidgetMutation({ positions: updatedPositions }).catch((error) => {
            console.log(error)
          })

          return newBoxes
        })
      }
    },
    [setBoxes, updateWidgetMutation]
  )

  return {
    handleDragEnd,
  }
}

export default useMainDashboardDragHandlers
