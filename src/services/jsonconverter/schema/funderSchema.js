export const JsonFunder = `
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "title": "Funding for Contributor or Project",
  "description": "Information about the funding for a Contributor or Project",
  "properties": {
    "funder": {
      "title": "Name of Funder:",
      "type": "string"
    },
    "description": {
      "title": "Description of the funding: ",
      "type": "string"
    },
    "identifier": {
      "title": "Funding number or other identifier:",
      "type": "string"
    }
  },
  "dependencies": {},
  "required": [
    "funder",
    "description",
    "identifier"
  ]
}
`

export const JsonFunderUI = `
{
  "ui:order": [
    "funder",
    "description",
    "identifier"
  ]
}
`
