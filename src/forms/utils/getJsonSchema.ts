import type { RJSFSchema } from "@rjsf/utils"

export default function getJsonSchema(json) {
  return JSON.parse(JSON.stringify(json)) as RJSFSchema
}
