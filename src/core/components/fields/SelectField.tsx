import { forwardRef, PropsWithoutRef } from "react"

export interface SelectFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["select"]> {
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: any[]
  optionText: string
  optionValue: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  multiple?: boolean
  disableFirstOption?: boolean
  error?: string
  name?: string
  description?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      name,
      description,
      outerProps,
      options,
      optionText,
      optionValue,
      multiple,
      disableFirstOption = true,
      ...props
    },
    ref
  ) => {
    return (
      <div {...outerProps}>
        {description && <p className="text-base mt-1">{description}</p>}
        <select
          name={name}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
          multiple={multiple}
          {...props}
          ref={ref}
        >
          {options?.map((v) => (
            <option key={v[optionValue]} value={v[optionValue]}>
              {v[optionText]}
            </option>
          ))}
        </select>

        {props.error && (
          <div role="alert" style={{ color: "red" }}>
            {props.error}
          </div>
        )}

        <style>{`
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

export default SelectField
