export const JsonDocument = `
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Project Document",
  "description": "Metadata about a document shared as part of the project",
  "properties": {
    "documentCategory": {
      "type": "string",
      "title": "Document Category:",
      "enum": ["Generic", "Text", "Audio", "Video", "Picture"],
      "default": "Generic"
    },
    "title": { "type": "string", "title": "Document Title:" },
    "type": { "type": "string", "title": "Document Type (e.g., stimulus material, analysis code, ethics approval):" },
    "creator": { "type": "string", "title": "Creator:" },
    "dateCreated": { "type": "string", "format": "date", "title": "Date Created:" },
    "identifier": { "type": "string", "title": "Document Identifier (e.g., URL, DOI):" },
    "description": { "type": "string", "format": "textarea", "title": "Description:" },
    "license": { "type": "string", "title": "License:" },
    "language": { "type": "string", "title": "Language:" },
    "fileFormat": { "type": "string", "title": "File Format (e.g., PDF, DOCX):" },
    "_stapleSchema": { "type": "string", "default": "document-v1",  "title": "Schema version", "readOnly": true }
  },
  "required": ["title", "type", "dateCreated", "identifier"],
  "allOf": [
    {
      "if": {
        "properties": { "documentCategory": { "const": "Generic" } }
      },
      "then": {
        "properties": {}
      }
    },
    {
      "if": {
        "properties": { "documentCategory": { "const": "Text" } }
      },
      "then": {
        "properties": {
          "wordCount": { "type": "integer", "title": "Word Count" },
          "characterEncoding": { "type": "string", "title": "Character Encoding (e.g., UTF-8)" }
        }
      }
    },
    {
      "if": {
        "properties": { "documentCategory": { "const": "Audio" } }
      },
      "then": {
        "properties": {
          "duration": { "type": "string", "title": "Duration (e.g., 02:30)" },
          "sampleRate": { "type": "integer", "title": "Sample Rate (Hz)" }
        }
      }
    },
    {
      "if": {
        "properties": { "documentCategory": { "const": "Video" } }
      },
      "then": {
        "properties": {
          "duration": { "type": "string", "title": "Duration" },
          "resolution": { "type": "string", "title": "Resolution (e.g., 1920x1080)" },
          "frameRate": { "type": "string", "title": "Frame Rate (e.g., 30fps)" }
        }
      }
    },
    {
      "if": {
        "properties": { "documentCategory": { "const": "Picture" } }
      },
      "then": {
        "properties": {
          "dimensions": { "type": "string", "title": "Dimensions (e.g., 800x600)" },
          "colorMode": { "type": "string", "title": "Color Mode (e.g., RGB)" }
        }
      }
    }
  ]
}
`

export const JsonDocumentUI = `
{
  "_stapleSchema": {
    "ui:widget": "hidden"
  },
  "ui:order": [
    "title",
    "type",
    "dateCreated",
    "identifier",
    "creator",
    "description",
    "license",
    "language",
    "documentCategory",
    "fileFormat",
    "wordCount",
    "characterEncoding",
    "duration",
    "sampleRate",
    "resolution",
    "frameRate",
    "dimensions",
    "colorMode",
    "_stapleSchema"
  ]
}
`
