import {
  JsonProjectMember,
  JsonProjectMemberUI,
} from "src/services/jsonconverter/schema/projectMemberSchema"
import { JsonFunder, JsonFunderUI } from "src/services/jsonconverter/schema/funderSchema"

export function getDefaultSchemaLists() {
  const schemas = [JsonProjectMember, JsonFunder]
  const uis = [JsonProjectMemberUI, JsonFunderUI]

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
