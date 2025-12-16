import React from "react"
import { useMultiSelect } from "./MultiSelectContext"

type MultiSelectCheckboxProps = {
  id: number
}

export const MultiSelectCheckbox = React.memo(({ id }: MultiSelectCheckboxProps) => {
  const { selectedIds, toggleSelection, isGlobalSelection } = useMultiSelect()
  const isChecked = isGlobalSelection || selectedIds.includes(id)

  return (
    <div>
      <span>
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-primary border-2"
            checked={isChecked}
            disabled={isGlobalSelection}
            onChange={() => toggleSelection(id)}
          />
        </label>
      </span>
    </div>
  )
})
