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

    return {
      name: formVersion.name, // Default to "Unknown" if formVersion is null
      updatedAt: form.updatedAt,
      uiSchema: formVersion.uiSchema || {},
      schema: formVersion.schema, // Default empty schema if formVersion is null
      id: form.id,
    }
  })
}
