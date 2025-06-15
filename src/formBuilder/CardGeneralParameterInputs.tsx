import React, { ReactElement } from "react"
import { Input, FormGroup, FormFeedback } from "reactstrap"
import classnames from "classnames"
import GeneralParameterInputs from "./GeneralParameterInputs"
import SelectField from "src/core/components/fields/SelectField"
import {
  defaultUiProps,
  defaultDataProps,
  categoryToNameMap,
  categoryType,
  subtractArray,
  getRandomId,
} from "./utils"
import type { Mods, ModLabels, FormInput, CardComponentPropsType } from "./types"
import Tooltip from "./Tooltip"

// specify the inputs required for any type of object
export default function CardGeneralParameterInputs({
  parameters,
  onChange,
  allFormInputs,
  mods,
  showObjectNameInput = true,
}: {
  parameters: CardComponentPropsType
  onChange: (newParams: CardComponentPropsType) => void
  mods?: Mods
  allFormInputs: { [key: string]: FormInput }
  showObjectNameInput?: boolean
}): ReactElement {
  const [keyState, setKeyState] = React.useState(parameters.name)
  const [keyError, setKeyError] = React.useState<null | string>(null)
  const [titleState, setTitleState] = React.useState(parameters.title)
  const [descriptionState, setDescriptionState] = React.useState(parameters.description)
  const [elementId] = React.useState(getRandomId())
  const categoryMap = categoryToNameMap(allFormInputs)

  const fetchLabel = (labelName: string, defaultLabel: string): string | undefined => {
    return mods && mods.labels && typeof mods.labels[labelName as keyof ModLabels] === "string"
      ? mods.labels[labelName as keyof ModLabels]
      : defaultLabel
  }

  const objectNameLabel = fetchLabel("objectNameLabel", "Variable Name")
  const displayNameLabel = fetchLabel("displayNameLabel", "Display Name")
  const descriptionLabel = fetchLabel("descriptionLabel", "Description")
  const inputTypeLabel = fetchLabel("inputTypeLabel", "Item Type")

  const availableInputTypes = () => {
    const definitionsInSchema =
      parameters.definitionData && Object.keys(parameters.definitionData).length !== 0

    let inputKeys = Object.keys(categoryMap).filter((key) => key !== "ref" || definitionsInSchema)
    if (mods) inputKeys = subtractArray(inputKeys, mods.deactivatedFormInputs)

    // Define manual group order
    const groupOrder = [
      "dateTime",
      "date",
      "time",
      "checkbox",
      "radio",
      "dropdown",
      "shortAnswer",
      "password",
      "longAnswer",
      "integer",
      "number",
      //"array",
      "ref",
    ]

    return groupOrder
      .filter((key) => inputKeys.includes(key))
      .map((key) => ({ value: key, label: categoryMap[key] }))
  }

  return (
    <React.Fragment>
      <div className="card-entry-row">
        {showObjectNameInput && (
          <div className="card-entry">
            <h5>
              {`${objectNameLabel} `}
              <Tooltip
                text={
                  mods &&
                  mods.tooltipDescriptions &&
                  typeof mods.tooltipDescriptions.cardObjectName === "string"
                    ? mods.tooltipDescriptions.cardObjectName
                    : "The name of the item when you download the data"
                }
                id={`${elementId}_nameinfo`}
                type="help"
              />
            </h5>

            <FormGroup>
              <Input
                invalid={keyError !== null}
                value={keyState || ""}
                placeholder="Key"
                type="text"
                onChange={(ev) => setKeyState(ev.target.value)}
                onBlur={(ev) => {
                  const { value } = ev.target
                  if (
                    value === parameters.name ||
                    !(parameters.neighborNames && parameters.neighborNames.includes(value))
                  ) {
                    setKeyError(null)
                    onChange({
                      ...parameters,
                      name: value,
                    })
                  } else {
                    setKeyState(parameters.name)
                    setKeyError(`"${value}" is already in use.`)
                    onChange({ ...parameters })
                  }
                }}
                className="card-text"
              />
              <FormFeedback>{keyError}</FormFeedback>
            </FormGroup>
          </div>
        )}
        <div className="card-entry">
          <h5>
            {`${displayNameLabel} `}
            <Tooltip
              text={
                mods &&
                mods.tooltipDescriptions &&
                typeof mods.tooltipDescriptions.cardDisplayName === "string"
                  ? mods.tooltipDescriptions.cardDisplayName
                  : "The item name shown on the form"
              }
              id={`${elementId}-titleinfo`}
              type="help"
            />
          </h5>
          <Input
            value={titleState || ""}
            placeholder="Title"
            type="text"
            onChange={(ev) => setTitleState(ev.target.value)}
            onBlur={(ev) => {
              onChange({ ...parameters, title: ev.target.value })
            }}
            className="card-text"
          />
        </div>
      </div>
      <div className="card-entry-row">
        <div className="card-entry">
          <h5>
            {`${descriptionLabel} `}
            <Tooltip
              text={
                mods &&
                mods.tooltipDescriptions &&
                typeof mods.tooltipDescriptions.cardDescription === "string"
                  ? mods.tooltipDescriptions.cardDescription
                  : "This will appear as help text on the form"
              }
              id={`${elementId}-descriptioninfo`}
              type="help"
            />
          </h5>
          <FormGroup>
            <Input
              value={descriptionState || ""}
              placeholder="Description"
              type="text"
              onChange={(ev) => setDescriptionState(ev.target.value)}
              onBlur={(ev) => {
                onChange({ ...parameters, description: ev.target.value })
              }}
              className="card-text"
            />
          </FormGroup>
        </div>
        <div
          className={classnames("card-entry", {
            "wide-card-entry": !showObjectNameInput,
          })}
        >
          <h5>
            {`${inputTypeLabel} `}
            <Tooltip
              text={
                mods &&
                mods.tooltipDescriptions &&
                typeof mods.tooltipDescriptions.cardInputType === "string"
                  ? mods.tooltipDescriptions.cardInputType
                  : "The type of item displayed on the form"
              }
              id={`${elementId}-inputinfo`}
              type="help"
            />
          </h5>
          <SelectField
            className="select text-primary select-bordered border-primary border-2 w-full mt-2 mb-2 bg-primary-content"
            value={parameters.category}
            onChange={(e) => {
              const newCategory = e.target.value
              const newProps = {
                ...defaultUiProps(newCategory, allFormInputs),
                ...defaultDataProps(newCategory, allFormInputs),
                name: parameters.name,
                required: parameters.required,
              }
              if (newProps.$ref !== undefined && !newProps.$ref) {
                const firstDefinition = Object.keys(parameters.definitionData!)[0]
                newProps.$ref = `#/definitions/${firstDefinition || "empty"}`
              }
              onChange({
                ...newProps,
                title: newProps.title || parameters.title,
                default: newProps.default || "",
                type: newProps.type || categoryType(newCategory, allFormInputs),
                category: newProps.category || newCategory,
              })
            }}
            options={availableInputTypes()}
            optionValue="value"
            optionText="label"
          />
        </div>
      </div>

      <div className="card-category-options">
        <GeneralParameterInputs
          category={parameters.category!}
          parameters={parameters}
          onChange={onChange}
          mods={mods}
          allFormInputs={allFormInputs}
        />
      </div>
    </React.Fragment>
  )
}
