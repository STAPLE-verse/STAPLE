import { setupBlitzServer } from "@blitzjs/next"
import { AuthServerPlugin, PrismaStorage } from "@blitzjs/auth"
import { simpleRolesIsAuthorized } from "@blitzjs/auth"
import { BlitzLogger } from "blitz"
import db from "db"
import { authConfig } from "./blitz-client"

const maskedKeys = ["password", "passwordConfirmation", "currentPassword"]
const maskPlaceholder = "[***]"

// tslog's built-in masking clone (triggered by `maskValuesOfKeys`) crashes on
// blitz's own Error classes (AuthenticationError, NotFoundError, etc) because
// their `stack` property is a getter/setter pair, and tslog tries to force
// `writable: true` onto that descriptor when cloning it. That crash happens
// inside @blitzjs/rpc's error handler before the real error is sent to the
// client, so requests fail with a generic "Bad Request" instead of the
// actual error (e.g. bad login credentials). Replace tslog's masking with an
// equivalent implementation that leaves Error objects untouched instead of
// re-cloning them, sidestepping the buggy codepath entirely.
const seen = new WeakSet<object>()
const maskValues = (value: unknown): unknown => {
  if (value instanceof Error) {
    // @blitzjs/rpc deliberately deletes `.stack` on expected errors (ones
    // marked `_clearStack`, e.g. AuthenticationError) before logging them.
    // tslog's pretty-printer assumes every Error has a stack string and
    // crashes (`getErrorTrace(...).map` on undefined) without one.
    if (typeof value.stack !== "string") {
      value.stack = `${value.name}: ${value.message}`
    }
    return value
  }
  if (value === null || typeof value !== "object") return value
  if (seen.has(value)) return value
  seen.add(value)
  if (Array.isArray(value)) return value.map(maskValues)
  if (value instanceof Date) return new Date(value.getTime())
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [
      key,
      maskedKeys.includes(key) ? maskPlaceholder : maskValues(val),
    ])
  )
}

export const { gSSP, gSP, api } = setupBlitzServer({
  plugins: [
    AuthServerPlugin({
      ...authConfig,
      storage: PrismaStorage(db),
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  logger: BlitzLogger({
    overwrite: {
      mask: (args) => args.map(maskValues),
    },
  }),
})
