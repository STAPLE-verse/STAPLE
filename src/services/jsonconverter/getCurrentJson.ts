import JsonSchema1 from "src/services/jsonconverter/schema/schema1"
import JsonSchema2 from "src/services/jsonconverter/schema/schema2"

export function getCurrentJson(schema) {
  const currentJsons = [JsonSchema1, JsonSchema2]
  if (schema.id < currentJsons.length) {
    return currentJsons[schema.id]
  }
  return JsonSchema1
}
