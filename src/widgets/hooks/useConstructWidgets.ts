import { ReactNode, useEffect, useState } from "react"
import { constructWidget } from "../utils/widgetRegistry"
import { sortWidgets } from "../utils/sortWidgets"
import { useMutation } from "@blitzjs/rpc"
import setWidgets from "src/widgets/mutations/setWidgets"
import toast from "react-hot-toast"

export type WidgetObject = {
  id: number
  title: string
  display: ReactNode
  link: ReactNode
  position: number
  size: string | null
  tooltipId: string
  tooltipContent: string
}

type UseWidgetConstructionProps = {
  userId: number
  widgets: any[]
  additionalData: any
}

export default function useWidgetConstruction({
  userId,
  widgets,
  additionalData,
}: UseWidgetConstructionProps): {
  boxes: WidgetObject[]
  setBoxes: React.Dispatch<React.SetStateAction<WidgetObject[]>>
} {
  const [boxes, setBoxes] = useState<WidgetObject[]>([])
  const [setWidgetMutation] = useMutation(setWidgets)

  useEffect(() => {
    if (widgets.length > 0) {
      const sortedWidgets = sortWidgets(widgets)
      const updatedBoxes = sortedWidgets.map((widget) =>
        constructWidget({ widget, ...additionalData })
      )
      setBoxes(updatedBoxes)
    } else {
      setWidgetMutation(userId)
        .then((createdWidgets) => {
          const updatedBoxes = createdWidgets.map((widget) =>
            constructWidget({ widget, ...additionalData })
          )
          setBoxes(updatedBoxes)
          toast.success(`Dashboard added successfully!`)
        })
        .catch(() => {
          toast.error(`Issue with dashboard, please contact help.`)
        })
    }
  }, [widgets, additionalData, setWidgetMutation, userId])

  return { boxes, setBoxes }
}
