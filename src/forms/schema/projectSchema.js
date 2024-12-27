export const JsonProject = `
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "title": "Project Information",
  "required": [],
  "properties": {
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
      "title": "Keywords:"
    },
    "publisher": {
      "type": "string",
      "title": "Publisher:",
      "description": "Keywords separated by commas."
    },
    "identifier": {
      "type": "string",
      "title": "Identifier:",
      "description": "DOI, ISSN, etc."
    }
  },
  "description": "Default Project Metadata",
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
