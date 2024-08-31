import { ReactNode, useEffect, useState } from "react"
import { sortWidgets } from "../utils/sortWidgets"
import { useMutation } from "@blitzjs/rpc"
import setWidgets from "src/widgets/mutations/setWidgets"
import toast from "react-hot-toast"
import { widgetRegistry } from "../utils/widgetRegistry"

export type WidgetObject = {
  id: number
  component: ReactNode
  position: number
}

type UseWidgetConstructionProps = {
  userId: number
  widgets: any[]
}

export default function useWidgetConstruction({ userId, widgets }: UseWidgetConstructionProps): {
  boxes: WidgetObject[]
  setBoxes: React.Dispatch<React.SetStateAction<WidgetObject[]>>
} {
  const [boxes, setBoxes] = useState<WidgetObject[]>([])
  const [setWidgetMutation] = useMutation(setWidgets)

  useEffect(() => {
    if (widgets.length > 0) {
      const sortedWidgets = sortWidgets(widgets)
      const updatedBoxes = sortedWidgets.map((widget) => {
        const WidgetComponent = widgetRegistry.main[widget.type]
        if (!WidgetComponent) {
          return {
            id: widget.id,
            component: <div>Unknown Widget Configuration</div>,
            position: widget.position,
          }
        }
        return {
          id: widget.id,
          component: <WidgetComponent key={widget.id} />,
          position: widget.position,
        }
      })
      setBoxes(updatedBoxes)
    } else {
      setWidgetMutation(userId)
        .then((createdWidgets) => {
          const updatedBoxes = createdWidgets.map((widget) => {
            const WidgetComponent = widgetRegistry.main[widget.type]
            return {
              id: widget.id,
              component: <WidgetComponent key={widget.id} />,
              position: widget.position,
            }
          })
          setBoxes(updatedBoxes)
          toast.success(`Dashboard added successfully!`)
        })
        .catch(() => {
          toast.error(`Issue with dashboard, please contact help.`)
        })
    }
  }, [widgets, setWidgetMutation, userId])

  return { boxes, setBoxes }
}
