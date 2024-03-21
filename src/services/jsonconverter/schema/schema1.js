const JsonSchema1 = `
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Contributor Information",
  "description": "Please enter your information to document your contributions. This information will be used to share who contributed to a project.",
  "type": "object",
  "required": ["givenName", "familyName", "email", "identifier"],
  "properties": {
    "givenName": {
      "type": "string",
      "title": "First Name:"
    },
    "additionalName": {
      "type": "string",
      "title": "Middle Name or Initial:"
    },
    "familyName": {
      "type": "string",
      "title": "Family or Last Name:"
    },
    "email": {
      "type": "string",
      "title": "Email:",
      "pattern": ".*@.*",
      "description": "Email to be used for official publications, this email can be different than your profile contact email."
    },
    "identifier": {
      "type": "string",
      "pattern": "https://orcid.org/[0-9].*",
      "title": "ORCID:",
      "description": "Enter the complete ORCID url. You can get an ORCID for free from https://orcid.org/."
    }
  }
}
`

export default JsonSchema1
