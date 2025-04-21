import { forwardRef, PropsWithoutRef } from "react"
import { useField } from "react-final-form"

export interface LabeledSelectFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["select"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  description?: string
  type?: "number" | "string"
  options: any
  optionText: string
  optionValue: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  multiple?: boolean
  disableFirstOption?: boolean
}

export const LabelSelectField = forwardRef<HTMLSelectElement, LabeledSelectFieldProps>(
  (
    {
      name,
      label,
      description,
      outerProps,
      options,
      optionText,
      optionValue,
      multiple,
      disableFirstOption = true,
      type = "number",
      ...props
    },
    ref
  ) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse: (value) => {
        if (value === "") {
          return null
        }
        return type === "number" ? Number(value) : value
      },
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    const firstOptionText = disableFirstOption ? "Please select an option" : "Select none"

    return (
      <div {...outerProps}>
        <label>{label} </label>
        <i>{description}</i>
        <br />
        <select {...input} disabled={submitting} multiple={multiple} {...props} ref={ref}>
          <option disabled={disableFirstOption} value="">
            {firstOptionText}
          </option>
          {options &&
            options.length !== 0 &&
            options.map((v) => {
              return (
                <option key={v.id} value={v[optionValue]}>
                  {v[optionText]}
                </option>
              )
            })}
        </select>

        {touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )}

        <style>{`
          label {
            display: flex;
            flex-direction: column;
            align-items: start;
            font-size: 1.25rem;
          }
          select {
            font-size: 1rem !important;
            padding: 0.25rem 0.75rem !important;
            border-radius: 3px;
            appearance: none;
            margin-top: 0.5rem;
          }
          select:focus {
            outline-color: oklch(var(--s)) !important;
            outline-offset: 0;
            outline-width: 3px !important;
          }
        `}</style>
      </div>
    )
  }
)

export default LabelSelectField
