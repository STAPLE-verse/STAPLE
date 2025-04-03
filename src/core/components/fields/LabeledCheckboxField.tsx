import React, { ComponentPropsWithoutRef, ReactNode } from "react"
import { useField, UseFieldConfig } from "react-final-form"
import { useId } from "@reach/auto-id"

export interface LabeledCheckboxFieldProps extends ComponentPropsWithoutRef<"input"> {
  /** Field name. */
  name: string
  /** Field label. Handle dynamic labels through functions. */
  label: ReactNode | ((value: boolean) => ReactNode)
  outerProps?: ComponentPropsWithoutRef<"div">
  fieldProps?: UseFieldConfig<string>
  labelProps?: ComponentPropsWithoutRef<"label">
}

export const LabeledCheckboxField = React.forwardRef<HTMLInputElement, LabeledCheckboxFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps = {}, className, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      type: "checkbox",
      ...fieldProps,
    })
    const id = useId() + "name"

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
    const showError = touched && normalizedError

    return (
      <div {...outerProps}>
        <div className="flex space-x-2 text-sm">
          <div className="h-5">
            <input
              id={id}
              key={id}
              disabled={submitting}
              className={className}
              ref={ref}
              {...input}
              {...props}
            />
          </div>
          <label htmlFor={id} className={labelProps.className} {...labelProps}>
            {typeof label === "function" ? label(input.checked ?? input.value) : label}
            <div role="alert" className="text-red-700 text-sm mt-1 font-bold">
              {showError && normalizedError}
            </div>
          </label>
        </div>
      </div>
    )
  }
)
