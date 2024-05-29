import {
  JsonContributor,
  JsonContributorUI,
} from "src/services/jsonconverter/schema/contributorSchema"
import { JsonFunder, JsonFunderUI } from "src/services/jsonconverter/schema/funderSchema"

export function getDefaultSchemaLists() {
  const schemas = [JsonContributor, JsonFunder]
  const uis = [JsonContributorUI, JsonFunderUI]

  const restructured = schemas.map((schema, index) => {
    const parsed = JSON.parse(schema)
    const uiparse = JSON.parse(uis[index])
    return {
      name: parsed.title,
      // 'id': parsed.$id,
      schema: parsed,
      ui: uiparse,
    }
  })

  return restructured
}
