import { JsonProjectMember, JsonProjectMemberUI } from "src/forms/schema/projectMemberSchema"
import { JsonFunder, JsonFunderUI } from "src/forms/schema/funderSchema"
import { JsonProject, JsonProjectUI } from "src/forms/schema/projectSchema"
import { JsonData, JsonDataUI } from "src/forms/schema/dataSchema"
import { JsonDocument, JsonDocumentUI } from "src/forms/schema/documentSchema"
import { JsonOrganization, JsonOrganizationUI } from "src/forms/schema/organizationSchema"

export function getDefaultSchemaLists() {
  const schemas = [
    JsonProjectMember,
    JsonFunder,
    JsonProject,
    JsonData,
    JsonDocument,
    JsonOrganization,
  ]
  const uis = [
    JsonProjectMemberUI,
    JsonFunderUI,
    JsonProjectUI,
    JsonDataUI,
    JsonDocumentUI,
    JsonOrganizationUI,
  ]

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
