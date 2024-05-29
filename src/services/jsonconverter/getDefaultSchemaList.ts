import JsonContributor from "src/services/jsonconverter/schema/contributorSchema"
import JsonFunder from "src/services/jsonconverter/schema/funderSchema"

export function getDefaultSchemaLists() {
  const schemas = [JsonContributor, JsonFunder]

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
