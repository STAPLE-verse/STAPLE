import EyeIcon from "@heroicons/react/24/outline/EyeIcon"
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon"

import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

export interface LabeledPassWordFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number" | "textarea"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
  onEyeClick: () => void
}

export const LabeledPasswordField = forwardRef<HTMLInputElement, LabeledPassWordFieldProps>(
  ({ onEyeClick, name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
    let validValue = (v) => (v === "" ? null : v)
    let myType = props.type === "number" ? (Number as any) : validValue
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse: myType,
      ...fieldProps,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps} data-testid="labeledpassword-testid">
        <label {...labelProps} className="flex flex-row">
          {label}
        </label>

        <div className="relative w-full max-w mx-auto">
          <input
            data-testid="inputtarget-testid"
            {...input}
            disabled={submitting}
            {...props}
            ref={ref}
            className={`${props.className || ""} w-full pr-10`} // Add padding to the right for the eye button
          />
          <button
            data-testid="showpassword-testid"
            className="absolute right-2 top-1/2 transform -translate-y-1/2" // Positioning the button inside the input field
            onClick={onEyeClick}
            type="button" // Ensure the button does not submit the form
          >
            {props.type === "password" && (
              <EyeIcon className="w-5 h-5" data-testid="eyeopen-testid" />
            )}
            {props.type === "text" && (
              <EyeSlashIcon className="w-5 h-5" data-testid="eyeclose-testid" />
            )}
          </button>
        </div>

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
          input {
            font-size: 1rem;
            padding: 0.25rem 0.5rem;
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

export default LabeledPasswordField
