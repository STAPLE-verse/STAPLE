import { Widget } from "db"

export function sortWidgets(widgets: Widget[]) {
  return widgets.sort((a, b) => a.position - b.position)
}
