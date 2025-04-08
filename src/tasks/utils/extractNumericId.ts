import { UniqueIdentifier } from "@dnd-kit/core"

export const extractNumericId = (rawId: UniqueIdentifier, prefix: string): number | undefined => {
  if (typeof rawId === "string" && rawId.startsWith(`${prefix}-`)) {
    return parseInt(rawId.replace(`${prefix}-`, ""), 10)
  }
  if (typeof rawId === "number") return rawId
  return undefined
}
