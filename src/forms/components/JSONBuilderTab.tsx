import React, { useState } from "react"
import { JsonEditor } from "json-edit-react"

interface JSONBuilderTabProps {
  schema: object
  uiSchema: object
  updateSchemaChange: (newSchema: object) => void
  updateUiSchemaChange: (newUiSchema: object) => void
}

const JSONBuilderTab: React.FC<JSONBuilderTabProps> = ({
  schema,
  uiSchema,
  updateSchemaChange,
  updateUiSchemaChange,
}) => {
  const [currentSchema, setCurrentSchema] = useState(schema)
  const [currentUiSchema, setCurrentUiSchema] = useState(uiSchema)
  const [restrictEdit, setRestrictEdit] = useState(true)

  const handleSchemaChange = (data: any) => {
    setCurrentSchema(data.newData)
  }

  const handleUiSchemaChange = (data: any) => {
    setCurrentUiSchema(data.newData)
  }

  const handleSave = () => {
    updateSchemaChange(currentSchema)
    updateUiSchemaChange(currentUiSchema)
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
            data={currentSchema}
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
            data={currentUiSchema}
            onUpdate={handleUiSchemaChange}
            restrictEdit={!restrictEdit}
            restrictDelete={!restrictEdit}
            restrictAdd={!restrictEdit}
            restrictTypeSelection={!restrictEdit}
            restrictDrag={!restrictEdit}
          />
        </div>
      </div>
      <button onClick={toggleEditable} className="btn btn-secondary self-end mb-4">
        {restrictEdit ? "Disable Editing" : "Enable Editing"}
      </button>
      {restrictEdit && (
        <button onClick={handleSave} className="btn btn-primary self-end">
          Save Form
        </button>
      )}
    </div>
  )
}

export default JSONBuilderTab
