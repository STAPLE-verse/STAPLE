// hooks/useWidgetConstruction.ts
import { useMemo } from "react"
import { ContributorPrivileges, Widget, WidgetSize } from "db"
import { widgetRegistry } from "../utils/widgetRegistry"

export type ConstructedWidget = {
  id: number
  component: React.ReactNode
  size?: WidgetSize
}

type UseWidgetConstructionProps = {
  widgets: Widget[]
  registryType: "main" | "project"
  privilege?: ContributorPrivileges
}

export const useWidgetConstruction = ({
  widgets,
  registryType,
  privilege,
}: UseWidgetConstructionProps): ConstructedWidget[] => {
  const constructedWidgets = useMemo(() => {
    return widgets.map((widget) => {
      const WidgetComponent = widgetRegistry[registryType][widget.type]

      if (!WidgetComponent) {
        return {
          id: widget.id,
          component: <div>Unknown Widget</div>,
          size: widget.size || WidgetSize.MEDIUM,
        }
      }

      // Pass the privilege only if the registryType is "project" and the component requires privilege
      const widgetProps = {
        key: widget.id,
        size: widget.size,
        ...(registryType === "project" && WidgetComponent.requiresPrivilege && { privilege }),
      }

      return {
        id: widget.id,
        component: <WidgetComponent {...widgetProps} />,
        size: widget.size || WidgetSize.MEDIUM,
      }
    })
  }, [widgets, registryType, privilege])

  return constructedWidgets
}
