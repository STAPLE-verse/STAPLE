const testJson2 = `{
  "title": "A registration form",
  "description": "A simple form example.",
  "type": "object",
  "required": [
    "firstName",
    "lastName"
  ],
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First name: ",
      "default": "Chuck"
    },
    "lastName": {
      "type": "string",
      "title": "Last name: ",
      "default": "Chuck"
    },
    "age": {
      "type": "integer",
      "title": "Age: ",
      "default": 10
    },
    "bio": {
      "type": "string",
      "title": "Bio: ",
      "default": ""
    },
    "password": {
      "type": "string",
      "title": "Password: ",
      "default": "",
      "minLength": 3
    },
    "telephone": {
      "type": "string",
      "title": "Telephone: ",
      "minLength": 10,
      "default": ""
    }
  }
}
`

export default testJson2
