import React, { FC } from "react"
import classnames from "classnames"

interface FBCheckboxProps {
  onChangeValue: (_arg0: { [key: string]: any }) => void
  isChecked: boolean
  id?: string
  label?: string
  use?: string
  value?: string
  disabled?: boolean
  dataTest?: string
  labelClassName?: string
}

const FBCheckbox: FC<FBCheckboxProps> = ({
  onChangeValue,
  value = "",
  isChecked = false,
  label = "",
  use = "action",
  disabled = false,
  id = "",
  dataTest = "",
  labelClassName = "",
}) => {
  const classes = classnames("fb-checkbox", {
    "edit-checkbox": !disabled && use === "edit",
    "action-checkbox": !disabled && use === "action",
    "disabled-checked-checkbox": disabled && isChecked,
    "disabled-unchecked-checkbox": disabled && !isChecked,
  })
  const potentialCheckboxId = id !== "" ? id : label
  const checkboxId = potentialCheckboxId !== "" ? potentialCheckboxId : undefined
  return (
    <div data-test="checkbox" className={`${classes} checkbox-style flex items-center`}>
      <input
        type="checkbox"
        id={checkboxId}
        data-test={dataTest || undefined}
        onChange={(event) => {
          if (!disabled) {
            onChangeValue(event)
          }
        }}
        value={value}
        disabled={disabled}
        checked={isChecked}
      />
      <div className="checkbox-overlay text-lg">
        {label && (
          <label htmlFor={checkboxId} className={labelClassName || undefined}>
            {label}
          </label>
        )}
      </div>
    </div>
  )
}

export default FBCheckbox
