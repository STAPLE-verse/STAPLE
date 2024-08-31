// hooks/useWidgetConstruction.ts
import { useMemo } from "react"
import { Widget, WidgetSize } from "db"
import { widgetRegistry } from "../utils/widgetRegistry"

export type ConstructedWidget = {
  id: number
  component: React.ReactNode
  size?: WidgetSize
}

type UseWidgetConstructionProps = {
  widgets: Widget[]
  registryType: "main" | "project"
}

export const useWidgetConstruction = ({
  widgets,
  registryType,
}: UseWidgetConstructionProps): ConstructedWidget[] => {
  const constructedWidgets = useMemo(() => {
    return widgets.map((widget) => {
      const WidgetComponent = widgetRegistry[registryType][widget.type]

      return {
        id: widget.id,
        component: WidgetComponent ? (
          <WidgetComponent key={widget.id} size={widget.size} />
        ) : (
          <div>Unknown Widget</div>
        ),
        size: widget.size || WidgetSize.MEDIUM,
      }
    })
  }, [widgets, registryType])

  return constructedWidgets
}
