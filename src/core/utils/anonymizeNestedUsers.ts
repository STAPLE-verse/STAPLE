import { Prisma } from "db"
import { getAnonymizedUser } from "./getAnonymizedUser"

export function anonymizeNestedUsers(obj: any, isInsideDeletedProjectMember = false): any {
  if (!obj || typeof obj !== "object") return obj

  // ✅ Preserve Date fields
  if (obj instanceof Date) return obj

  // ✅ Preserve Prisma.Decimal fields
  if (obj instanceof Prisma.Decimal) return new Prisma.Decimal(obj.toString())

  // ✅ Convert BigInt fields to string to avoid serialization issues
  if (typeof obj === "bigint") return obj.toString()

  // 🔥 If this object is an array, apply anonymization recursively
  if (Array.isArray(obj)) {
    return obj.map((item) => anonymizeNestedUsers(item, isInsideDeletedProjectMember))
  }

  const newObj = { ...obj }

  // 🔥 If this is a ProjectMember, track if it is soft-deleted
  if ("deleted" in newObj && typeof newObj.deleted === "boolean") {
    isInsideDeletedProjectMember = newObj.deleted
  }

  // 🔥 If this is a User inside a soft-deleted ProjectMember, anonymize it
  if (isInsideDeletedProjectMember && "id" in newObj && "username" in newObj) {
    return getAnonymizedUser(newObj)
  }

  // 🔥 Recursively process other fields
  for (const key in newObj) {
    newObj[key] = anonymizeNestedUsers(newObj[key], isInsideDeletedProjectMember)
  }

  return newObj
}
