import { ComponentPropsWithoutRef, forwardRef, PropsWithoutRef, useState } from "react"
import { useField, UseFieldConfig } from "react-final-form"
import moment from "moment"

export interface DateFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  ({ name, label, outerProps, labelProps, fieldProps, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, fieldProps)

    const [dateInputValue, setDateInputValue] = useState<string>(() => {
      return input.value ? moment(input.value).format("YYYY-MM-DDTHH:mm") : ""
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setDateInputValue(value)
      if (value === "") {
        input.onChange(null)
      } else {
        input.onChange(new Date(value))
      }
    }

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps}>
        <label {...labelProps}>
          {label}
          <input
            {...input}
            value={dateInputValue}
            className="input input-bordered text-lg
            border-primary rounded w-1/2 border-2
            bg-base-300 text-primary"
            type="datetime-local"
            min={moment().format("YYYY-MM-DDTHH:mm")}
            max="2050-01-01T00:00"
            onChange={handleChange}
            disabled={submitting}
            ref={ref}
            {...props}
            data-testid="datefield-input"
          />
        </label>

        {touched && normalizedError && (
          <div role="alert" className="text-error mt-1">
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
          input {
            font-size: 1rem;
            padding: 0.25rem 0.75rem !important;
            border-radius: 3px;
            appearance: none;
            margin-top: 0.5rem;
          }

          input:focus {
            outline-color: oklch(var(--s)) !important;
            outline-offset: 0;
            outline-width: 3px !important;
          }
        `}</style>
      </div>
    )
  }
)

export default DateField
