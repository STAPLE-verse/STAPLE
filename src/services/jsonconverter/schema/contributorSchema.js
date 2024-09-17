export const JsonProjectMember = `
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "title": "Contributor Information",
  "required": [
    "givenName",
    "familyName",
    "email",
    "identifier"
  ],
  "properties": {
    "email": {
      "type": "string",
      "title": "Email:",
      "format": "email",
      "description": "Email to be used for official publications, this email can be different than your profile contact email."
    },
    "givenName": {
      "type": "string",
      "title": "First Name:"
    },
    "familyName": {
      "type": "string",
      "title": "Family or Last Name:"
    },
    "identifier": {
      "type": "string",
      "title": "ORCID:",
      "default": "https://orcid.org/0000-0000-0000-0000",
      "description": "Enter the complete ORCID url. You can get an ORCID for free from https://orcid.org/."
    },
    "additionalName": {
      "type": "string",
      "title": "Middle Name or Initial:"
    }
  },
  "description": "Please enter your information to document your contributions. This information will be used to share who contributed to a project.",
  "dependencies": {}
}
`

export const JsonProjectMemberUI = `
{
  "ui:order": [
    "givenName",
    "additionalName",
    "familyName",
    "email",
    "identifier"
  ]
}
`
