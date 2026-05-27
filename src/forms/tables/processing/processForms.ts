import { FormWithFormVersion, FormFolder } from "src/forms/queries/getForms"

export type FormTableData = {
  name: string
  updatedAt: Date
  uiSchema: any
  schema: any
  id: number
  tags: string[]
  folder: FormFolder | null
}

export function processForms(forms: FormWithFormVersion[]): FormTableData[] {
  return forms.map((form) => {
    const formVersion = form.formVersion || { uiSchema: {}, schema: {}, name: "Unknown" }

    return {
      name: formVersion.name,
      updatedAt: form.updatedAt,
      uiSchema: formVersion.uiSchema || {},
      schema: formVersion.schema,
      id: form.id,
      tags: Array.isArray(form.tags) ? (form.tags as string[]) : [],
      folder: form.folder,
    }
  })
}
