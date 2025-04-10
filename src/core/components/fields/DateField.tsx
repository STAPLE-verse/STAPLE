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

    // Ensure the initial state is only a date (or empty if none)
    const [dateInputValue, setDateInputValue] = useState<string>(
      input.value ? moment(input.value).format("YYYY-MM-DD") : ""
    )

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value

      if (value === "") {
        setDateInputValue("")
        input.onChange(null)
      } else {
        // Ensure the date is stored as midnight in local time
        const localDate = moment(value).endOf("day") // Sets to local midnight (00:00)
        setDateInputValue(localDate.format("YYYY-MM-DD")) // Keep input display clean
        input.onChange(localDate.toDate()) // Ensure it saves correctly in the DB
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
            placeholder="No date selected"
            className="input input-bordered text-lg
            border-primary rounded w-1/2 border-2
            bg-base-300 text-primary"
            type="date" // Changed to date type
            min={moment().format("YYYY-MM-DD")}
            max="2050-01-01"
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
