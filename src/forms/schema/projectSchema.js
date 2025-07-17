export const JsonProject = `
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "title": "Project Information",
  "required": ["name", "identifier", "keywords"],
  "properties": {
    "name": {
      "type": "string",
      "title": "Project Name:"
    },
    "abstract": {
      "type": "string",
      "title": "Abstract:"
    },
    "citation": {
      "type": "string",
      "title": "Citation:"
    },
    "keywords": {
      "type": "string",
      "title": "Keywords:",
      "description": "Keywords separated by commas."
    },
    "publisher": {
      "type": "string",
      "title": "Publisher:"
    },
    "identifier": {
      "type": "string",
      "title": "Identifier:",
      "description": "DOI, ISSN, etc."
    }
  },
  "description": "Default Project Metadata",
  "_stapleSchema": {
    "type": "string",
    "default": "project-v1",
    "title": "Schema version",
    "readOnly": true
  },
  "dependencies": {}
}
`

export const JsonProjectUI = `
{
  "abstract": {
    "ui:widget": "textarea"
  },
  "citation": {
    "ui:widget": "textarea"
  },
  "ui:order": [
    "abstract",
    "keywords",
    "citation",
    "publisher",
    "identifier"
  ]
}
`
