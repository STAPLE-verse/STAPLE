export type DragType = "item" | "container"

export type DragId = `${DragType}-${number}`

/**
 * Create a stable drag ID
 * @example makeDragId("item", 3) -> "item-3"
 */
export function makeDragId(type: DragType, id: number): DragId {
  return `${type}-${id}` as DragId
}

/**
 * Parse a drag ID
 * @example parseDragId("item-3") -> { type: "item", id: 3 }
 */
export function parseDragId(dragId: string): { type: DragType; id: number } | null {
  const match = dragId.match(/^(item|container)-(\d+)$/)
  if (!match) return null
  const [, type, id] = match
  return { type: type as DragType, id: Number(id) }
}
