import db from "db"

export default async function getUsers() {
  const users = await db.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      username: true,
    },
  })

  return users
}
