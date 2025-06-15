import React, { ReactElement } from "react"
import classnames from "classnames"
import FBRadioButton from "./FBRadioButton"

type FBRadioGroupPropsType = {
  options: Array<{ label: string | ReactElement; value: string | number }>
  onChange: (selection: string) => void
  defaultValue?: any
  horizontal?: boolean
  id?: string | number
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

export default function FBRadioGroup(props: FBRadioGroupPropsType): ReactElement {
  const { options, defaultValue, onChange, horizontal, id, autoFocus, disabled } = props
  const name = Math.random().toString()
  // Removed JSS class usage
  const classes = classnames("fb-radio-group", {
    horizontal,
  })

  // Conditionallly add 'id' prop in case id was not passed in from parent.
  let elementId = {}
  if (id) {
    elementId = { id }
  }

  return (
    <div {...elementId} className={`${classes} radio-group`}>
      {options.map((option, index) => (
        <FBRadioButton
          value={option.value}
          label={option.label}
          {...elementId}
          name={name}
          // @ts-ignore: suppress key error, can't change key assignment
          key={option.value}
          checked={option.value === defaultValue}
          autoFocus={autoFocus && index === 1}
          onChange={onChange}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
