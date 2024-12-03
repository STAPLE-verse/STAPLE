import { useEffect, useState } from "react"

interface UserBase {
  id: number
  username: string
  firstName?: string | null
  lastName?: string | null
}
interface ProjectMemberBase {
  id: number
  name: string | null
  deleted: boolean
  users: UserBase[]
}

export function useSanitizedProjectMembers<T extends ProjectMemberBase>(members: T[]): T[] {
  const [sanitizedMembers, setSanitizedMembers] = useState<T[]>([])

  useEffect(() => {
    const updatedMembers = members.map((member) => {
      if (member.deleted) {
        if (member.name) {
          // Deleted team member: anonymize the name
          return { ...member, name: "Anonymous" }
        } else if (member.name === null && member.users.length > 0) {
          // Deleted individual contributor: sanitize user data
          const updatedUsers = member.users.map((user) => ({
            ...user,
            username: "Anonymous",
            firstName: user.firstName !== undefined ? "" : user.firstName,
            lastName: user.lastName !== undefined ? "" : user.lastName,
          }))
          return { ...member, users: updatedUsers }
        }
      }
      return member
    })

    setSanitizedMembers(updatedMembers)
  }, [members])

  return sanitizedMembers
}
