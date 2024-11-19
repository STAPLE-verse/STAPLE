import React from "react"
import { FormSpy } from "react-final-form"

interface ValidationErrorDisplayProps {
  fieldName: string
}

const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({ fieldName }) => (
  <FormSpy subscription={{ errors: true, touched: true }}>
    {({ errors = {}, touched = {} }) => {
      const hasError = errors[fieldName]
      const isTouched = touched[fieldName] ?? true

      return hasError && isTouched ? (
        <div role="alert" style={{ color: "red" }}>
          {errors[fieldName]}
        </div>
      ) : null
    }}
  </FormSpy>
)

export default ValidationErrorDisplay
