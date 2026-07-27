import { setupBlitzServer } from "@blitzjs/next"
import { AuthServerPlugin, PrismaStorage } from "@blitzjs/auth"
import { simpleRolesIsAuthorized } from "@blitzjs/auth"
import { BlitzLogger } from "blitz"
import db from "db"
import { authConfig } from "./blitz-client"

const baseLogger = BlitzLogger({})

// tslog's key-masking clone (triggered by BlitzLogger's `maskValuesOfKeys`)
// crashes on blitz's own Error classes (AuthenticationError, NotFoundError, etc)
// because their `stack` property is still a lazy accessor at throw time, and
// tslog tries to force `writable: true` onto it. That crash happens inside
// @blitzjs/rpc's error handler before the real error is sent to the client,
// so requests fail with a generic "Bad Request" instead of the actual error
// (e.g. bad login credentials). Fall back to console logging if it happens.
const logLevels = ["silly", "trace", "debug", "info", "warn", "error", "fatal"] as const
for (const level of logLevels) {
  const original = baseLogger[level].bind(baseLogger)
  baseLogger[level] = (...args: unknown[]) => {
    try {
      return original(...args)
    } catch {
      return console.error(`[${level}]`, ...args)
    }
  }
}

export const { gSSP, gSP, api } = setupBlitzServer({
  plugins: [
    AuthServerPlugin({
      ...authConfig,
      storage: PrismaStorage(db),
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  logger: baseLogger,
})
