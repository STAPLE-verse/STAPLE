export const JsonProject = `
{
  "$schema": "http://json-schema.org/draft-07/schema#",
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
    },
    "license": {
      "type": "string",
      "title": "License:",
      "description": "Name or URL of the license under which this project is shared"
    },
    "_stapleSchema": {
      "type": "string",
      "default": "project-v1",
      "title": "Schema version",
      "readOnly": true
    }
  },
  "description": "Default Project Metadata",
  "dependencies": {}
}
`

export const JsonProjectUI = `
{
  "_stapleSchema": {
    "ui:widget": "hidden"
  },
  "abstract": {
    "ui:widget": "textarea"
  },
  "citation": {
    "ui:widget": "textarea"
  },
  "ui:order": [
    "name",
    "abstract",
    "keywords",
    "citation",
    "publisher",
    "identifier",
    "license",
    "_stapleSchema"
  ]
}
`
