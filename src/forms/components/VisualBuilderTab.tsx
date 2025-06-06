import React from "react"
import FormBuilder from "src/formBuilder/FormBuilder"

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
        <button type="button" className="btn btn-primary mb-4" onClick={onSave}>
          Save Form
        </button>
      </div>
      <FormBuilder
        schema={JSON.stringify(schema)}
        uischema={JSON.stringify(uiSchema)}
        mods={{}}
        onChange={(newSchema: string, newUiSchema: string) => {
          const parsedSchema = JSON.parse(newSchema)

          // Remove "exclusiveMinimum" and "exclusiveMaximum" if they are null
          if (parsedSchema.properties) {
            Object.keys(parsedSchema.properties).forEach((key) => {
              const property = parsedSchema.properties[key]

              // Remove "exclusiveMinimum" and "exclusiveMaximum" if they are null
              if (property.exclusiveMinimum === null) {
                delete property.exclusiveMinimum
              }
              if (property.exclusiveMaximum === null) {
                delete property.exclusiveMaximum
              }
            })
          }

          onChange(parsedSchema, JSON.parse(newUiSchema))
        }}
      />
    </div>
  )
}

export default VisualBuilderTab
