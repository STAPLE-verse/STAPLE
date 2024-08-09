export function extendSchema({ schema, extension }) {
  // Check if schema is an object and not an array
  if (schema && typeof schema === "object" && !Array.isArray(schema)) {
    // Merge the schema with the extension
    return {
      ...schema,
      ...extension,
    }
  }
  // Return the schema if it is not an object
  return schema
}

// Function to remove submit button from forms
export function noSubmitButton(uiSchema) {
  return extendSchema({
    schema: uiSchema,
    extension: {
      "ui:submitButtonOptions": {
        norender: true,
      },
    },
  })
}
