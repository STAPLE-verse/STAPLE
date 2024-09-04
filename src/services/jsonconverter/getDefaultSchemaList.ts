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
    const newUi =
      uis[index] != null && uis[index] != undefined ? (uis[index] as string) : String("{}")
    const uiparse = JSON.parse(newUi)
    return {
      label: parsed.title,
      id: index + 1,
      schema: parsed,
      uiSchema: uiparse,
    }
  })

  return restructured
}
