import { remainingDefaultTemplatePackagesV1 } from "src/forms/templates/defaultTemplatePackagesV1"
import { projectMemberTemplatePackageV1 } from "src/forms/templates/projectMemberTemplateV1"

export interface DefaultSchemaTemplate {
  label: string
  id: number
  schema: any
  uiSchema: any
  semantics: any
}

function cloneJson(value: unknown): any {
  return JSON.parse(JSON.stringify(value))
}

export function getDefaultSchemaLists(): DefaultSchemaTemplate[] {
  const packages = [projectMemberTemplatePackageV1, ...remainingDefaultTemplatePackagesV1]

  return packages.map((templatePackage, index) => ({
    label: templatePackage.metadata.title,
    id: index + 1,
    schema: cloneJson(templatePackage.form.schema),
    uiSchema: cloneJson(templatePackage.form.uiSchema),
    semantics: cloneJson(templatePackage.semantics),
  }))
}
