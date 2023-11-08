import { RJSFSchema } from "@rjsf/utils"

function removeField(obj, keyToDelete, compareFunc) {
  let isArray = Array.isArray(obj)
  Object.keys(obj).forEach((key) => {
    let k = isArray ? obj[key] : key
    if (compareFunc(k, keyToDelete)) {
      delete obj[key]
    } else {
      let value = obj[key]
      if (value instanceof Object) {
        removeField(value, keyToDelete, compareFunc)
      }
    }
  })

  if (isArray) {
    for (var i = obj.length - 1; i >= 0; i--) {
      if (!obj[i]) {
        obj.splice(i, 1)
      }
    }
  }
}

export default function getJsonSchema(json) {
  const schema: RJSFSchema = JSON.parse(json)
  removeField(schema, "@", (key, keyToDelete) => "@" == key[0])
  removeField(schema, "$", (key, keyToDelete) => "$" == key[0])
  return schema
}
