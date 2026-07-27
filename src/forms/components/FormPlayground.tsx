import React, { useState } from "react"
import { Tab } from "@headlessui/react"
import classNames from "classnames"
import {
  FormBuilder,
  FormPreview,
  FormStudioProvider,
  JsonEditor,
  useFormStudio,
  type FormStudioState,
} from "@staple-verse/form-studio"
import FormTagEditor from "./FormTagEditor"
import FormFolderSelector from "./FormFolderSelector"
import FormDeployments from "./FormDeployments"
import CollapseCard from "src/core/components/CollapseCard"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import { FormVersionWithRelations } from "../queries/getForm"

interface FormPlaygroundProps {
  initialSchema?: string
  initialUiSchema?: string
  saveForm: (formState: FormStudioState) => void
  formId?: number
  initialTags?: string[]
  initialFolderId?: number | null
  versions?: FormVersionWithRelations[]
  currentVersionId?: number
  formArchived?: boolean
  infoOnly?: boolean
  onAutoSave?: (state: FormStudioState) => Promise<void>
  onVersionsUpdated?: () => Promise<void> | void
}

type FormPlaygroundContentProps = Omit<FormPlaygroundProps, "initialSchema" | "initialUiSchema">

const FormPlaygroundContent: React.FC<FormPlaygroundContentProps> = ({
  saveForm,
  formId,
  initialTags = [],
  initialFolderId = null,
  versions = [],
  currentVersionId,
  formArchived = false,
  infoOnly = false,
  onAutoSave,
  onVersionsUpdated,
}) => {
  const { state, setSchema, setUiSchema } = useFormStudio()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [hasVisitedJson, setHasVisitedJson] = useState(false)
  const hasCurrentVersionId = typeof currentVersionId === "number"
  const jsonTabIndex = formId ? 2 : 1

  const handleSave = () => {
    saveForm(state)
  }

  return (
    <Tab.Group
      selectedIndex={selectedIndex}
      onChange={(index) => {
        if (index === jsonTabIndex) {
          setHasVisitedJson(true)
        }
        const leavingBuilderTab = formId ? selectedIndex !== 0 : true
        if (onAutoSave && leavingBuilderTab && !infoOnly) {
          void onAutoSave(state)
        }
        setSelectedIndex(index)
      }}
    >
      <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2 mb-4">
        {formId && (
          <Tab
            className={({ selected }) =>
              classNames("tab", "text-lg", selected ? "tab-active" : "hover:text-gray-500")
            }
          >
            Information
          </Tab>
        )}
        {!infoOnly && (
          <>
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
          </>
        )}
      </Tab.List>

      {!infoOnly && (
        <div className="w-full flex justify-end mb-4">
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save Form
          </button>
        </div>
      )}

      <Tab.Panels>
        {formId && (
          <Tab.Panel>
            <div className="flex flex-col gap-4">
              <CollapseCard title="Organization: Tags, Folder" defaultOpen={true}>
                <div className="flex flex-col gap-6 mt-2">
                  <div className="w-2/3 mt-4">
                    <label className="text-base-content text-base">
                      <span className="flex items-center mb-2">
                        Tags:
                        <InformationCircleIcon
                          className="h-4 w-4 ml-1 text-info stroke-2"
                          data-tooltip-id="form-tags-overview"
                        />
                        <Tooltip
                          id="form-tags-overview"
                          content="Use a comma, semicolon, enter, or tab to create separate tags. To edit a tag, click on it, and then hit the enter key when you are finished."
                          className="z-[1099] ourtooltips"
                        />
                      </span>
                    </label>
                    <p className="text-sm italic text-base-content/80 mb-2">
                      Tags only save after you press enter, comma, or semicolon.
                    </p>
                    <FormTagEditor formId={formId} initialTags={initialTags} />
                  </div>
                  <div>
                    <label className="text-base-content text-base">
                      <span className="flex items-center mb-2">Folder:</span>
                    </label>
                    <FormFolderSelector formId={formId} currentFolderId={initialFolderId} />
                  </div>
                </div>
              </CollapseCard>
              <CollapseCard title="Versions and Tasks" defaultOpen={true}>
                <div className="mt-2">
                  {hasCurrentVersionId ? (
                    <FormDeployments
                      versions={versions}
                      currentVersionId={currentVersionId}
                      formArchived={formArchived}
                      onDeleted={onVersionsUpdated}
                    />
                  ) : (
                    <p className="text-md italic text-base-content/80">No versions available.</p>
                  )}
                </div>
              </CollapseCard>
            </div>
          </Tab.Panel>
        )}

        {!infoOnly && (
          <>
            <Tab.Panel>
              <FormBuilder
                schema={JSON.stringify(state.schema)}
                uiSchema={JSON.stringify(state.uiSchema)}
                onChange={(schema, uiSchema) => {
                  setSchema(JSON.parse(schema))
                  setUiSchema(JSON.parse(uiSchema))
                }}
              />
            </Tab.Panel>

            <Tab.Panel unmount={false} className="h-[70vh] min-h-[500px] w-full">
              {hasVisitedJson && <JsonEditor />}
            </Tab.Panel>

            <Tab.Panel>
              <FormPreview />
            </Tab.Panel>
          </>
        )}
      </Tab.Panels>
    </Tab.Group>
  )
}

const FormPlayground: React.FC<FormPlaygroundProps> = ({
  initialSchema = "{}",
  initialUiSchema = "{}",
  ...props
}) => {
  return (
    <FormStudioProvider initialSchema={initialSchema} initialUiSchema={initialUiSchema}>
      <FormPlaygroundContent {...props} />
    </FormStudioProvider>
  )
}

export default FormPlayground
