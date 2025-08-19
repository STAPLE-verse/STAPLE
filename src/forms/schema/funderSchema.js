export const JsonFunder = `
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Funding for Contributor or Project",
  "description": "Information about the funding for a Contributor or Project",
  "properties": {
    "funder": {
      "title": "Name of Funder:",
      "type": "string"
    },
    "identifier": {
      "title": "Identifier for the funder (e.g., ROR or Crossref Funder ID):",
      "type": "string",
      "description": "A global identifier for the funder, such as a Crossref Funder Registry ID or ROR ID"
    },
    "awardTitle": {
      "type": "string",
      "title": "Title of the Award:"
    },
    "description": {
      "title": "Description of the funding: ",
      "type": "string"
    },
    "_stapleSchema": {
      "type": "string",
      "default": "funder-v1",
      "title": "Schema version",
      "readOnly": true
    }
  },
  "dependencies": {},
  "required": [
    "funder",
    "identifier",
    "description"
  ]
}
`

export const JsonFunderUI = `
{
  "_stapleSchema": {
    "ui:widget": "hidden"
  },
  "ui:order": [
    "funder",
    "identifier",
    "awardTitle",
    "description",
    "_stapleSchema"
  ]
}
`
