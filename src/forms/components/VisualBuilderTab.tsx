import React from "react"
import { FormBuilder } from "@ginkgo-bioworks/react-json-schema-form-builder"

interface VisualBuilderTabProps {
  schema: object
  uiSchema: object
  onSave: () => void
  onChange: (newSchema: object, newUiSchema: object) => void
}

const VisualBuilderTab: React.FC<VisualBuilderTabProps> = ({
  schema,
  uiSchema,
  onSave,
  onChange,
}) => {
  return (
    <div className="formHead-wrapper">
      <div className="w-full flex justify-end">
        <button type="button" className="btn btn-primary" onClick={onSave}>
          Save Form
        </button>
      </div>
      <br />
      <FormBuilder
        schema={JSON.stringify(schema)}
        uischema={JSON.stringify(uiSchema)}
        mods={{}}
        onChange={(newSchema: string, newUiSchema: string) => {
          onChange(JSON.parse(newSchema), JSON.parse(newUiSchema))
        }}
      />
    </div>
  )
}

export default VisualBuilderTab
