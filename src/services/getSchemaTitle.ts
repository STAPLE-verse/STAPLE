export function getSchemaTitle(jsonSchema) {
  return jsonSchema != null && jsonSchema.hasOwnProperty("title") ? jsonSchema["title"] : ""
}
