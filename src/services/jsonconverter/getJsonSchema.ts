import { RJSFSchema } from "@rjsf/utils"

export default function getJsonSchema(json) {
  const schema: RJSFSchema = JSON.parse(json)
  return schema
}
