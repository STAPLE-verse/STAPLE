import { ProjectWidget, Widget } from "db"

export function sortWidgets(widgets: Widget[] | ProjectWidget[]) {
  return widgets.sort((a, b) => a.position - b.position)
}
