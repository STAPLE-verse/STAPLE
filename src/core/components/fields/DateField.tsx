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
            className="input input-bordered text-lg mb-4 border-primary rounded w-1/2 border-2 bg-base-300"
            type="datetime-local"
            min={moment().format("YYYY-MM-DDTHH:mm")}
            max="2050-01-01T00:00"
            onChange={handleChange}
            disabled={submitting}
            ref={ref}
            {...props}
          />
        </label>

        {touched && normalizedError && (
          <div role="alert" className="text-error mt-1">
            {normalizedError}
          </div>
        )}
      </div>
    )
  }
)

export default DateField
