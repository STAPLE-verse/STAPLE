import JSONInput from "react-json-editor-ajrm"
import locale from "react-json-editor-ajrm/locale/en"

import { FormBuilder } from "@ginkgo-bioworks/react-json-schema-form-builder"
import Form from "@rjsf/core"
import validator from "@rjsf/validator-ajv8"
import { Tab } from "@headlessui/react"
import { useEffect, useState } from "react"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const FormPlayground = ({ initialSchema = "{}", initialUiSchema = "{}", saveForm }) => {
  const [state, setState] = useState({
    schema: initialSchema,
    uischema: initialUiSchema,
    formData: {},
  })
  const [render, setRender] = useState(false)

  useEffect(() => {
    if (!render) {
      setRender(true)
    }

    //console.log(state.schema)
  }, [])

  // TODO: This logs a lot - remove
  useEffect(() => {
    //console.log(state.formData)
  })

  return render ? (
    <Tab.Group defaultIndex={0}>
      <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2 mb-4">
        {/* Tablink for board view */}
        <Tab
          className={({ selected }) =>
            classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
          }
        >
          Preview
        </Tab>
        {/* TabLink for table view */}
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
        {/* TODO: First click on board does not change it after init */}
      </Tab.List>

      <Tab.Panels>
        {/* Tab for Preview */}
        <Tab.Panel>
          <Form
            schema={JSON.parse(state.schema)}
            uiSchema={JSON.parse(state.uischema)}
            //onChange={(newFormData) => setState({formData: newFormData.formData})}
            formData={state.formData}
            validator={validator}
            //submitButtonMessage={"Submit"}
          />
        </Tab.Panel>

        {/* Tabpanel for Visual Builder */}
        <Tab.Panel>
          <div className="formHead-wrapper">
            <button type="button" className="btn btn-primary" onClick={() => saveForm(state)}>
              Save
            </button>

            <br />
            <FormBuilder
              schema={state.schema}
              uischema={state.uischema}
              mods={{}}
              onChange={(newSchema, newUiSchema) => {
                setState({
                  schema: newSchema,
                  uischema: newUiSchema,
                  formData: state.formData,
                })
              }}
            />
          </div>
        </Tab.Panel>

        {/* Tabpanel for JSON Builder */}
        <Tab.Panel>
          <div className="flex flex-row justify-between">
            <div>
              <h4>Data Schema</h4>
              <JSONInput
                id="data_schema"
                placeholder={
                  state.schema
                    ? (() => {
                        try {
                          return JSON.parse(state.schema)
                        } catch (e) {
                          console.error(e)
                          return {}
                        }
                      })()
                    : {}
                }
                locale={locale}
                height="550px"
                //onChange={(data: any) => updateSchema(data.json)}
              />
            </div>
            <div>
              <h4>UI Schema</h4>
              <JSONInput
                id="ui_schema"
                placeholder={state.uischema ? JSON.parse(state.uischema) : {}}
                locale={locale}
                height="550px"
                //onChange={(data: any) => this.updateUISchema(data.json)}
              />
            </div>
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  ) : null
}
