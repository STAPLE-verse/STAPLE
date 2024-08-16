import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UsernameExist } from "../schemas"

export class UserEmailExistErr extends Error {
  code?: string
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

export default resolver.pipe(resolver.zod(UsernameExist), async ({ email, username }, ctx) => {
  const userExist = await db.user.findUnique({
    where: {
      username: username,
    },
  })
  if (userExist != null) {
    throw new UserEmailExistErr("user exist", "user_exist")
  }

  const emailExist = await db.user.findUnique({
    where: {
      email: email,
    },
  })
  if (emailExist != null) {
    throw new UserEmailExistErr("email exist", "email_exist")
  }

  return true
})
