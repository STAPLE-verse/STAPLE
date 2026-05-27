import React, { useEffect, useState } from "react"
import { Tab } from "@headlessui/react"
import classNames from "classnames"
import VisualBuilderTab from "./VisualBuilderTab"
import JSONBuilderTab from "./JSONBuilderTab"
import validator from "@rjsf/validator-ajv8"
import JsonForm from "src/core/components/JsonForm"
import { noSubmitButton } from "../utils/extendSchema"
import FormTagEditor from "./FormTagEditor"
import FormFolderSelector from "./FormFolderSelector"
import FormDeployments from "./FormDeployments"
import CollapseCard from "src/core/components/CollapseCard"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

interface FormPlaygroundProps {
  initialSchema?: string
  initialUiSchema?: string
  saveForm: (formState: { schema: object; uischema: object; formData: object }) => void
  formId?: number
  initialTags?: string[]
  initialFolderId?: number | null
}

interface FormState {
  schema: object
  uischema: object
  formData: object
  extendedUiSchema: object
}

const FormPlayground: React.FC<FormPlaygroundProps> = ({
  initialSchema = "{}",
  initialUiSchema = "{}",
  saveForm,
  formId,
  initialTags = [],
  initialFolderId = null,
}) => {
  const [state, setState] = useState<FormState>({
    schema: JSON.parse(initialSchema),
    uischema: JSON.parse(initialUiSchema),
    extendedUiSchema: noSubmitButton(JSON.parse(initialUiSchema)),
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
    //("🧪 incoming schema", newSchema)
    //console.log("🧪 incoming uischema", newUiSchema)

    setState({
      schema: newSchema,
      uischema: newUiSchema,
      formData: state.formData,
      extendedUiSchema: noSubmitButton(newUiSchema),
    })
  }

  return render ? (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2 mb-4">
        <Tab
          className={({ selected }) =>
            classNames("tab", "text-lg", selected ? "tab-active text" : "hover:text-gray-500")
          }
        >
          Visual Builder
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames("tab", "text-lg", selected ? "tab-active" : "hover:text-gray-500")
          }
        >
          JSON Builder
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames("tab", "text-lg", selected ? "tab-active" : "hover:text-gray-500")
          }
        >
          Preview
        </Tab>
        {formId && (
          <Tab
            className={({ selected }) =>
              classNames("tab", "text-lg", selected ? "tab-active" : "hover:text-gray-500")
            }
          >
            Details
          </Tab>
        )}
      </Tab.List>

      <div className="w-full flex justify-end mb-4">
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Save Form
        </button>
      </div>

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
            uiSchema={state.extendedUiSchema}
            formData={state.formData}
            validator={validator}
          />
        </Tab.Panel>

        {formId && (
          <Tab.Panel>
            <div className="flex flex-col gap-4">
              <CollapseCard title="Organization: Tags, Folder" defaultOpen={true}>
                <div className="flex flex-col gap-6 mt-2">
                  <div>
                    <label className="text-base-content">
                      <span className="flex items-center mb-2">
                        Tags:
                        <InformationCircleIcon
                          className="h-4 w-4 ml-1 text-info stroke-2"
                          data-tooltip-id="tags-overview"
                        />
                        <Tooltip
                          id="tags-overview"
                          content="Use a comma, semicolon, enter, or tab to create separate tags. To edit a tag, click on
            it, and then hit the enter key when you are finished."
                          className="z-[1099] ourtooltips"
                        />
                      </span>
                    </label>
                    <FormTagEditor formId={formId} initialTags={initialTags} />
                  </div>
                  <div>
                    <label className="text-base-content">
                      <span className="flex items-center mb-2">Folder:</span>
                    </label>
                    <FormFolderSelector formId={formId} currentFolderId={initialFolderId} />
                  </div>
                </div>
              </CollapseCard>
              <CollapseCard title="Assigned Tasks & Projects" defaultOpen={true}>
                <div className="mt-2">
                  <FormDeployments formId={formId} />
                </div>
              </CollapseCard>
            </div>
          </Tab.Panel>
        )}
      </Tab.Panels>
    </Tab.Group>
  ) : null
}

export default FormPlayground
