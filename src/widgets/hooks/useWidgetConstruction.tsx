// hooks/useWidgetConstruction.ts
import { useMemo } from "react"
import { Widget } from "db"
import { widgetRegistry } from "../utils/widgetRegistry"

export type ConstructedWidget = {
  id: number
  component: React.ReactNode
}

export const useWidgetConstruction = (widgets: Widget[]): ConstructedWidget[] => {
  const constructedWidgets = useMemo(() => {
    return widgets.map((widget) => {
      const WidgetComponent = widgetRegistry.main[widget.type]

      return {
        id: widget.id,
        component: WidgetComponent ? (
          <WidgetComponent key={widget.id} />
        ) : (
          <div>Unknown Widget</div>
        ),
      }
    })
  }, [widgets])

  return constructedWidgets
}
