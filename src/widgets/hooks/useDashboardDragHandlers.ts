import { useCallback } from "react"
import { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { UpdateWidgetPositionInput } from "../mutations/updateWidget"
import { Widget } from "db"

interface DragHandlersProps {
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>
  updateWidgetMutation: (input: { positions: UpdateWidgetPositionInput }) => Promise<any>
}

const useMainDashboardDragHandlers = ({ setWidgets, updateWidgetMutation }: DragHandlersProps) => {
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        setWidgets((widgets) => {
          const oldIndex = widgets.findIndex((widget) => widget.id === active.id)
          const newIndex = widgets.findIndex((widget) => widget.id === over.id)
          const newWidgets = arrayMove(widgets, oldIndex, newIndex)

          // Update positions based on new order in the state
          const updatedPositions = newWidgets.map((widget, index) => ({
            id: widget.id,
            position: index + 1,
          }))

          // Call the mutation
          updateWidgetMutation({ positions: updatedPositions }).catch((error) => {
            console.error("Failed to update widget positions:", error)
          })

          return newWidgets
        })
      }
    },
    [setWidgets, updateWidgetMutation]
  )

  return {
    handleDragEnd,
  }
}

export default useMainDashboardDragHandlers
