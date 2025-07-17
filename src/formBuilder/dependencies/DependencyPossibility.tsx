import React, { useState, ReactElement } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import Tooltip from "../Tooltip"
import CardSelector from "./CardSelector"
import ValueSelector from "./ValueSelector"
import { getRandomId } from "../utils"
import { UncontrolledTooltip } from "reactstrap"

// a possible dependency
export default function DependencyPossibility({
  possibility,
  neighborNames,
  onChange,
  onDelete,
  parentEnums,
  parentType,
  parentName,
  parentSchema,
}: {
  possibility: {
    children: Array<string>
    value?: any
  }
  neighborNames: Array<string>
  onChange: (newPossibility: { children: Array<string>; value?: any }) => void
  onDelete: () => void
  parentEnums?: Array<string | number>
  parentType?: string
  parentName?: string
  parentSchema?: any
}): ReactElement {
  const [elementId] = useState(getRandomId())
  return (
    <div className="form-dependency-condition mt-4 mb-4">
      <div className="text-[18px] font-bold">
        Display the following:{" "}
        <Tooltip
          id={`${elementId}_bulk`}
          type="help"
          text="Choose the other form items for the dependency"
        />
      </div>
      <CardSelector
        possibleChoices={neighborNames.filter((name) => name !== parentName) || []}
        chosenChoices={possibility.children}
        onChange={(chosenChoices: Array<string>) =>
          onChange({ ...possibility, children: [...chosenChoices] })
        }
        placeholder="Choose a dependent..."
      />
      <div className="text-[18px] font-bold">
        If &quot;{parentName}&quot; has {possibility.value ? "the value:" : "a value."}
      </div>
      <div style={{ display: possibility.value ? "block" : "none" }}>
        <ValueSelector
          possibility={possibility}
          onChange={(newPossibility: { children: Array<string>; value?: any }) =>
            onChange(newPossibility)
          }
          parentEnums={parentEnums}
          parentType={parentType}
          parentName={parentName}
          parentSchema={parentSchema}
        />
      </div>
      <span id={`${elementId}_deldependency`}>
        <XMarkIcon className="h-6 w-6 text-secondary" strokeWidth={4} onClick={() => onDelete()} />
      </span>
      <UncontrolledTooltip placement="top" target={`${elementId}_deldependency`}>
        Delete this dependency
      </UncontrolledTooltip>
    </div>
  )
}
