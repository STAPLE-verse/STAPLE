const JsonSchema2 = `
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Contributor Information",
  "description": "Please enter your information.",
  "type": "object",
  "required": [
    "givenName",
    "familyName",
    "email",
    "identifier"
  ],
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
    }
  }
}
`

export default JsonSchema2
