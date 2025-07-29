export const JsonOrganization = `
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Organization",
  "description": "Basic metadata about the organization or institution",
  "properties": {
    "name": {
      "type": "string",
      "title": "Organization Name:"
    },
    "identifier": {
      "type": "string",
      "title": "Organization Identifier (e.g., ROR ID):",
      "description": "A globally unique ID for the organization. Search for your organization's ID at https://ror.org."
    },
    "url": {
      "type": "string",
      "format": "uri",
      "title": "Website URL:"
    },
    "city": {
      "type": "string",
      "title": "City:"
    },
    "country": {
      "type": "string",
      "title": "Country:",
      "description": "The country or recognized territory where the organization is based."
    },
    "_stapleSchema": {
      "type": "string",
      "default": "organization-v1",
      "title": "Schema version",
      "readOnly": true
    }
  },
  "required": [
    "name",
    "identifier"
  ]
}
`

export const JsonOrganizationUI = `
{
  "_stapleSchema": {
    "ui:widget": "hidden"
  },
  "ui:order": [
    "name",
    "identifier",
    "url",
    "city",
    "country",
    "_stapleSchema"
  ]
}
`
