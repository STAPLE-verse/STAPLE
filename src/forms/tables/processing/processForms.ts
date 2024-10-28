import { FormWithFormVersion } from "src/forms/queries/getForms"

export type FormTableData = {
  name: string
  updatedAt: Date
  uiSchema: any
  schema: any
  id: number
}

export function processForms(forms: FormWithFormVersion[]): FormTableData[] {
  return forms.map((form) => {
    // Handle cases where formVersion is null
    const formVersion = form.formVersion || { uiSchema: {}, schema: {}, name: "Unknown" }

    const uiSchema = formVersion.uiSchema || {}
    let extendedUiSchema = {}

    // Preprocess uiSchema only if it is an object and not an array
    if (uiSchema && typeof uiSchema === "object" && !Array.isArray(uiSchema)) {
      // Modify the uiSchema to hide the submit button
      extendedUiSchema = {
        ...uiSchema,
        "ui:submitButtonOptions": {
          norender: true,
        },
      }
    }

    return {
      name: formVersion.name, // Default to "Unknown" if formVersion is null
      updatedAt: form.updatedAt,
      uiSchema: extendedUiSchema,
      schema: formVersion.schema, // Default empty schema if formVersion is null
      id: form.id,
    }
  })
}
