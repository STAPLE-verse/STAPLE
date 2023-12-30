import { SecurePassword } from "@blitzjs/auth/secure-password"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Role } from "types"
import { Signup } from "../schemas"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password, username }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: {
      email: email.toLowerCase().trim(),
      hashedPassword,
      role: "USER",
      username: username,
      tos: true,
    },
    select: { id: true, email: true, role: true, username: true, tos: true },
  })

  await ctx.session.$create({ userId: user.id, role: user.role as Role })
  return user
})
