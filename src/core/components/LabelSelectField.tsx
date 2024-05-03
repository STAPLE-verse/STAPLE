import { forwardRef, PropsWithoutRef } from "react"
import { useField } from "react-final-form"

export interface LabeledSelectFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["select"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  type?: "number" | "string"
  options: any
  optionText: string
  optionValue: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  multiple?: boolean
}

export const LabelSelectField = forwardRef<HTMLSelectElement, LabeledSelectFieldProps>(
  (
    {
      name,
      label,
      outerProps,
      options,
      optionText,
      optionValue,
      multiple,
      type = "number",
      ...props
    },
    ref
  ) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse: type === "number" ? Number : undefined,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps}>
        <label>
          {label}
          <select {...input} disabled={submitting} multiple={multiple} {...props} ref={ref}>
            <option disabled value="">
              Please select an option
            </option>
            {options &&
              options.map((v) => {
                return (
                  <option key={v.id} value={v[optionValue]}>
                    {v[optionText]}
                  </option>
                )
              })}
          </select>
        </label>

        {touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )}

        <style jsx>{`
          label {
            display: flex;
            flex-direction: column;
            align-items: start;
            font-size: 1.25rem;
          }
          select {
            font-size: 1rem;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            border: 1px solid purple;
            appearance: none;
            margin-top: 0.5rem;
          }
        `}</style>
      </div>
    )
  }
)

export default LabelSelectField
