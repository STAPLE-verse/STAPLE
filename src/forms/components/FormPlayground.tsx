import React, { useEffect, useState } from "react"
import { Tab } from "@headlessui/react"
import classNames from "classnames"
import VisualBuilderTab from "./VisualBuilderTab"
import JSONBuilderTab from "./JSONBuilderTab"
import validator from "@rjsf/validator-ajv8"
import JsonForm from "src/core/components/JsonForm"

interface FormPlaygroundProps {
  initialSchema?: string
  initialUiSchema?: string
  saveForm: (formState: { schema: object; uischema: object; formData: object }) => void
}

interface FormState {
  schema: object
  uischema: object
  formData: object
}

const FormPlayground: React.FC<FormPlaygroundProps> = ({
  initialSchema = "{}",
  initialUiSchema = "{}",
  saveForm,
}) => {
  const [state, setState] = useState<FormState>({
    schema: JSON.parse(initialSchema),
    uischema: JSON.parse(initialUiSchema),
    formData: {},
  })
  const [render, setRender] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!render) {
      setRender(true)
    }
  }, [render])

  const handleSave = () => {
    saveForm(state)
  }

  const handleChange = (newSchema: object, newUiSchema: object) => {
    setState({
      schema: newSchema,
      uischema: newUiSchema,
      formData: state.formData,
    })
  }

  return render ? (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2 mb-4">
        <Tab
          className={({ selected }) =>
            classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
          }
        >
          Visual Builder
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
          }
        >
          JSON Builder
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
          }
        >
          Preview
        </Tab>
      </Tab.List>

      <Tab.Panels>
        <Tab.Panel>
          <VisualBuilderTab
            schema={state.schema}
            uiSchema={state.uischema}
            onSave={handleSave}
            onChange={handleChange}
          />
        </Tab.Panel>

        <Tab.Panel>
          <JSONBuilderTab
            schema={state.schema}
            uiSchema={state.uischema}
            onSave={handleSave}
            onChange={handleChange}
          />
        </Tab.Panel>

        <Tab.Panel>
          <JsonForm
            schema={state.schema}
            uiSchema={state.uischema}
            formData={state.formData}
            validator={validator}
          />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  ) : null
}

export default FormPlayground
