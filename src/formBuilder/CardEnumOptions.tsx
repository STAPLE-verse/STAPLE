import React, { ReactElement } from "react"
import { Input, UncontrolledTooltip } from "reactstrap"
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline"

interface CardEnumOptionsProps {
  initialValues: Array<any>
  names?: Array<string>
  showNames: boolean
  onChange: (newEnums: Array<any>, newEnumNames?: Array<string>) => void
  type: string
}

// Input field corresponding to an array of values, add and remove
export default function CardEnumOptions({
  initialValues,
  names,
  showNames,
  onChange,
  type,
}: CardEnumOptionsProps): ReactElement {
  const possibleValues = []
  for (let index = 0; index < initialValues.length; index += 1) {
    const value = initialValues[index]
    let name = `${value}`
    if (names && index < names.length) name = names[index] ?? ""
    possibleValues.push(
      //@ts-ignore
      <div key={index} className="card-enum-option">
        <Input
          value={value === undefined || value === null ? "" : value}
          placeholder="Stored Value"
          key={`val-${index}`}
          type={type === "string" ? "text" : "number"}
          onChange={(ev: any) => {
            let newVal
            switch (type) {
              case "string":
                newVal = ev.target.value
                break
              case "number":
              case "integer":
                newVal = parseFloat(ev.target.value)
                if (Number.isInteger(newVal)) newVal = parseInt(ev.target.value, 10)
                // TODO: Possible unused condition, since we know it is a number or integer in this case.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (Number.isNaN(newVal)) newVal = type === "string" ? "" : 0
                break
              default:
                throw new Error(`Enum called with unknown type ${type}`)
            }
            onChange(
              [...initialValues.slice(0, index), newVal, ...initialValues.slice(index + 1)],
              names
            )
          }}
          className="card-text"
        />
        <Input
          value={name || ""}
          placeholder="Label"
          key={`name-${index}`}
          type="text"
          onChange={(ev: any) => {
            if (names)
              onChange(initialValues, [
                ...names.slice(0, index),
                ev.target.value,
                ...names.slice(index + 1),
              ])
          }}
          className="card-text"
          style={{ display: showNames ? "initial" : "none" }}
        />
        <div className="delete-button">
          <XMarkIcon
            onClick={() => {
              // remove this value
              onChange(
                [...initialValues.slice(0, index), ...initialValues.slice(index + 1)],
                names ? [...names.slice(0, index), ...names.slice(index + 1)] : undefined
              )
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      {possibleValues}
      <span id="add-enum-option">
        <PlusIcon
          className="h-6 w-6 stroke-secondary mt-2 mb-2"
          strokeWidth={4}
          onClick={() => {
            // add a new dropdown option
            onChange(
              [...initialValues, type === "string" ? "" : 0],
              names ? [...names, ""] : undefined
            )
          }}
        />
      </span>
      <UncontrolledTooltip placement="top" target="add-enum-option">
        Add new possible option
      </UncontrolledTooltip>
    </React.Fragment>
  )
}
