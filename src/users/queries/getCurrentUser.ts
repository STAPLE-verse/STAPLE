import { Ctx } from "blitz"
import db, { Prisma } from "db"

export type CurrentUser = Prisma.UserGetPayload<{
  select: {
    id: true
    firstName: true
    lastName: true
    email: true
    role: true
    createdAt: true
    username: true
    institution: true
    language: true
    gravatar: true
    tooltips: true
  }
}>

export default async function getCurrentUser(
  _ = null,
  { session }: Ctx
): Promise<CurrentUser | null> {
  if (!session.userId) return null

  const user = await db.user.findFirst({
    where: { id: session.userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      username: true,
      institution: true,
      language: true,
      gravatar: true,
      tooltips: true,
    },
  })

  return user
}
