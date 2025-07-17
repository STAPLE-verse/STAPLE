import { UniqueIdentifier } from "@dnd-kit/core"
import { DNDType } from "../hooks/useTaskBoardData"

export function findContainerById(id: number, containers: DNDType[]) {
  return containers.find((container) => container.id === id)
}

export function findContainerByItemId(itemId: number, containers: DNDType[]) {
  return containers.find((container) => container.items.some((item) => item.id === itemId))
}

export function findContainerTitle(id: number, containers: DNDType[]) {
  const container = findContainerById(id, containers)
  if (!container) return ""
  return container.title
}

export function findContainerItems(id: number, containers: DNDType[]) {
  const container = findContainerById(id, containers)
  if (!container) return []
  return container.items
}

type ItemKeys = keyof DNDType["items"][number]

// Update the function signature to return the type of each key
export function findItemValue<T extends ItemKeys>(
  id: number,
  containers: DNDType[],
  key: T
): DNDType["items"][number][T] | undefined {
  const container = findContainerByItemId(id, containers)
  if (!container) return undefined
  const item = container.items.find((item) => item.id === id)
  if (!item) return undefined
  return item[key] // Return the actual type of the property
}
