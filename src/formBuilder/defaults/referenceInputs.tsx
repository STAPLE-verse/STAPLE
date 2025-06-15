import React from "react"
import type { FormInput, CardComponentType } from "../types"
import SelectField from "src/core/components/fields/SelectField"
import { PlaceholderInput } from "../inputs/PlaceholderInput"

export const CardReferenceParameterInputs: CardComponentType = ({ parameters, onChange }) => {
  return (
    <div>
      <PlaceholderInput parameters={parameters} onChange={onChange} />
    </div>
  )
}

const RefChoice: CardComponentType = ({ parameters, onChange }) => {
  const pathArr = (parameters.$ref || "").split("/")
  const currentValueLabel =
    pathArr.length === 3 &&
    pathArr[0] === "#" &&
    pathArr[1] === "definitions" &&
    pathArr[2] &&
    (parameters.definitionData || {})[pathArr[2]]
      ? parameters.definitionData![pathArr[2]].title || parameters.$ref
      : parameters.$ref

  return (
    <div className="card-select">
      <SelectField
        className="select select-bordered w-full mt-2 mb-2 text-primary border-primary border-2 bg-primary-content"
        value={parameters.$ref || ""}
        onChange={(e) => onChange({ ...parameters, $ref: e.target.value })}
        options={Object.keys(parameters.definitionData || {}).map((key) => ({
          value: `#/definitions/${key}`,
          label: parameters.definitionData![key].title || `#/definitions/${key}`,
        }))}
        optionValue="value"
        optionText="label"
      />
    </div>
  )
}

const referenceInputs: { [key: string]: FormInput } = {
  ref: {
    displayName: "Reference",
    matchIf: [
      {
        types: ["null"],
        $ref: true,
      },
    ],
    defaultDataSchema: {
      $ref: "",
      title: "",
      description: "",
    },
    defaultUiSchema: {},
    type: "string",
    cardBody: RefChoice,
    modalBody: CardReferenceParameterInputs,
  },
}

export default referenceInputs
