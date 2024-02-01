import JsonSchema1 from "src/services/jsonconverter/schema/schema1"
import JsonSchema2 from "src/services/jsonconverter/schema/schema2"

export function getDefaultSchemaLists() {
  const schemas = [JsonSchema1, JsonSchema2]

  const restructured = schemas.map((schema) => {
    const parsed = JSON.parse(schema)
    return {
      name: parsed.title,
      // 'id': parsed.$id,
      schema: parsed,
    }
  })

  return restructured
}
