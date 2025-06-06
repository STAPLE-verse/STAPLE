import React, { useState, ReactElement } from "react"
import Select from "react-select"
import { getRandomId } from "../utils"
import { XMarkIcon } from "@heroicons/react/24/outline"

// a field that lets you choose adjacent blocks
export default function CardSelector({
  possibleChoices,
  chosenChoices,
  onChange,
  placeholder,
}: {
  possibleChoices: Array<string>
  chosenChoices: Array<string>
  onChange: (chosenChoices: Array<string>) => void
  placeholder: string
}): ReactElement {
  const [elementId] = useState(getRandomId())
  return (
    <React.Fragment>
      <ul>
        {chosenChoices.map((chosenChoice, index) => (
          <li key={`${elementId}_neighbor_${index}`}>
            {chosenChoice}{" "}
            <XMarkIcon
              onClick={() =>
                onChange([...chosenChoices.slice(0, index), ...chosenChoices.slice(index + 1)])
              }
            />
          </li>
        ))}
      </ul>
      <Select
        value={{
          value: "",
          label: "",
        }}
        placeholder={placeholder}
        options={possibleChoices
          .filter((choice) => !chosenChoices.includes(choice))
          .map((choice) => ({
            value: choice,
            label: choice,
          }))}
        onChange={(val: any) => {
          onChange([...chosenChoices, val.value])
        }}
        className="card-modal-select"
      />
    </React.Fragment>
  )
}
