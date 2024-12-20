import { UniqueIdentifier } from "@dnd-kit/core"
import { DNDType } from "../hooks/useTaskBoardData"

export function findValueOfItems(
  id: UniqueIdentifier | undefined,
  type: string,
  containers: DNDType[]
) {
  if (type === "container") {
    return containers.find((item) => item.id === id)
  }
  if (type === "item") {
    return containers.find((container) => container.items.find((item) => item.id === id))
  }
}

export function findContainerTitle(id: UniqueIdentifier | undefined, containers: DNDType[]) {
  const container = findValueOfItems(id, "container", containers)
  if (!container) return ""
  return container.title
}

export function findContainerItems(id: UniqueIdentifier | undefined, containers: DNDType[]) {
  const container = findValueOfItems(id, "container", containers)
  if (!container) return []
  return container.items
}

type ItemKeys = keyof DNDType["items"][number]

// Update the function signature to return the type of each key
export function findItemValue<T extends ItemKeys>(
  id: UniqueIdentifier | undefined,
  containers: DNDType[],
  key: T
): DNDType["items"][number][T] | undefined {
  const container = findValueOfItems(id, "item", containers)
  if (!container) return undefined
  const item = container.items.find((item) => item.id === id)
  if (!item) return undefined
  return item[key] // Return the actual type of the property
}
