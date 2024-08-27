import React, { useState } from "react"
import { JsonEditor } from "json-edit-react"

interface JSONBuilderTabProps {
  schema: object
  uiSchema: object
  onSave: () => void
  onChange: (newSchema: object, newUiSchema: object) => void
}

const JSONBuilderTab: React.FC<JSONBuilderTabProps> = ({ schema, uiSchema, onSave, onChange }) => {
  const [restrictEdit, setRestrictEdit] = useState(true)

  const handleSchemaChange = (data: any) => {
    onChange(data.newData, uiSchema) // Notify parent of schema change
  }

  const handleUiSchemaChange = (data: any) => {
    onChange(schema, data.newData) // Notify parent of uiSchema change
  }

  const toggleEditable = () => {
    setRestrictEdit(!restrictEdit)
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between mb-4">
        <div style={{ width: "48%" }}>
          <h4>Data Schema</h4>
          <JsonEditor
            data={schema}
            onUpdate={handleSchemaChange}
            restrictEdit={!restrictEdit}
            restrictDelete={!restrictEdit}
            restrictAdd={!restrictEdit}
            restrictTypeSelection={!restrictEdit}
            restrictDrag={!restrictEdit}
          />
        </div>
        <div style={{ width: "48%" }}>
          <h4>UI Schema</h4>
          <JsonEditor
            data={uiSchema}
            onUpdate={handleUiSchemaChange}
            restrictEdit={!restrictEdit}
            restrictDelete={!restrictEdit}
            restrictAdd={!restrictEdit}
            restrictTypeSelection={!restrictEdit}
            restrictDrag={!restrictEdit}
          />
        </div>
      </div>

      <div className="flex self-end">
        <div>
          <button onClick={toggleEditable} className="btn btn-secondary mx-2">
            {restrictEdit ? "Disable Editing" : "Enable Editing"}
          </button>
        </div>
        <div>
          {restrictEdit && (
            <button onClick={onSave} className="btn btn-primary">
              Save Form
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default JSONBuilderTab
