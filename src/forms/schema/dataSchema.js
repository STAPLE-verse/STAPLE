export const JsonData = `
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "Research Data",
  "description": "Metadata about structured research data (e.g., tabular, audio, image) for FAIR sharing and reuse.",
  "properties": {
    "title": {
      "type": "string",
      "title": "Data Title:"
    },
    "description": {
      "type": "string",
      "format": "textarea",
      "title": "Description:"
    },
    "identifier": {
      "type": "string",
      "title": "Data Identifier (e.g., DOI, URL):"
    },
    "creator": {
      "type": "string",
      "title": "Creator:"
    },
    "dateCreated": {
      "type": "string",
      "format": "date",
      "title": "Date Created:"
    },
    "license": {
      "type": "string",
      "title": "License:"
    },
    "dataType": {
      "type": "string",
      "title": "Data Type:",
      "enum": ["Tabular", "Text", "Audio", "Video", "Image", "Other"],
      "default": "Other"
    },
    "format": {
      "type": "string",
      "title": "File Format (e.g., CSV, JSON, PNG, WAV):"
    },
    "size": {
      "type": "string",
      "title": "Total Size (e.g., 2.3 MB for full dataset):"
    },
    "fileList": {
      "type": "array",
      "title": "File Names or Paths (optional)",
      "items": {
        "type": "string"
      }
    },
    "language": {
      "type": "string",
      "title": "Language (if applicable):"
    },
    "codebookLink": {
      "type": "string",
      "title": "Link to Codebook:",
      "description": "URL to a codebook or variable documentation for this dataset"
    },
    "version": {
      "type": "string",
      "title": "Dataset Version:"
    },
    "conformsTo": {
      "type": "string",
      "title": "Metadata Standard (if applicable):",
      "description": "A URL or name of the metadata/data standard this dataset conforms to"
    },
    "isAccessibleForFree": {
      "type": "boolean",
      "title": "Is Accessible for Free?",
      "description": "Check this if the dataset is freely available without access restrictions"
    },
    "isBasedOn": {
      "type": "string",
      "title": "Based On (Source Dataset):",
      "description": "Link or citation for the dataset this derives from (if using secondary or reused data)"
    },
    "_stapleSchema": {
      "type": "string",
      "default": "data-v1",
      "title": "Schema version",
      "readOnly": true
    }
  },
  "required": [
    "title",
    "identifier",
    "format",
    "dateCreated"
  ],
  "allOf": [
    {
      "if": {
        "properties": { "dataType": { "const": "Text" } }
      },
      "then": {
        "properties": {
          "wordCount": {
            "type": "integer",
            "title": "Word Count"
          },
          "characterEncoding": {
            "type": "string",
            "title": "Character Encoding"
          }
        },
        "required": [
          "wordCount",
          "characterEncoding"
        ]
      }
    },
    {
      "if": {
        "properties": { "dataType": { "const": "Audio" } }
      },
      "then": {
        "properties": {
          "duration": {
            "type": "string",
            "title": "Duration (e.g., 3m20s)"
          },
          "sampleRate": {
            "type": "integer",
            "title": "Bit Rate"
          }
        },
        "required": [
          "duration",
          "sampleRate"
        ]
      }
    },
    {
      "if": {
        "properties": { "dataType": { "const": "Video" } }
      },
      "then": {
        "properties": {
          "duration": {
            "type": "string",
            "title": "Duration (e.g., 10m45s)"
          },
          "width": {
            "type": "string",
            "title": "Video Width (e.g., 1920 px)"
          },
          "height": {
            "type": "string",
            "title": "Video Height (e.g., 1080 px)"
          },
          "bitRate": {
            "type": "integer",
            "title": "Bit Rate"
          }
        },
        "required": [
          "duration",
          "width",
          "height",
          "bitRate"
        ]
      }
    },
    {
      "if": {
        "properties": { "dataType": { "const": "Image" } }
      },
      "then": {
        "properties": {
          "width": {
            "type": "string",
            "title": "Image Width (e.g., 1024 px)"
          },
          "height": {
            "type": "string",
            "title": "Image Height (e.g., 768 px)"
          }
        },
        "required": [
          "width",
          "height"
        ]
      }
    },
    {
      "required": [
        "dataType"
      ]
    }
  ]
}
`

export const JsonDataUI = `
{
  "_stapleSchema": {
    "ui:widget": "hidden"
  },
  "ui:order": [
    "title",
    "description",
    "identifier",
    "creator",
    "dateCreated",
    "license",
    "dataType",
    "format",
    "wordCount",
    "characterEncoding",
    "duration",
    "sampleRate",
    "width",
    "height",
    "bitRate",
    "size",
    "fileList",
    "language",
    "codebookLink",
    "version",
    "conformsTo",
    "isAccessibleForFree",
    "isBasedOn",
    "_stapleSchema"
  ]
}
`
