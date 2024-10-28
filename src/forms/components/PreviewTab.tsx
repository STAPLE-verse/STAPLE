import React from "react"
import JsonForm from "src/core/components/JsonForm"
import validator from "@rjsf/validator-ajv8"

interface PreviewTabProps {
  schema: object
  uiSchema: object
  formData: object
}

const PreviewTab: React.FC<PreviewTabProps> = ({ schema, uiSchema, formData }) => {
  return <JsonForm schema={schema} uiSchema={uiSchema} formData={formData} validator={validator} />
}

export default PreviewTab
