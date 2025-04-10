import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

export interface LabeledTextAreaFieldProps
  extends PropsWithoutRef<JSX.IntrinsicElements["textarea"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number" | "textarea"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const LabeledTextAreaField = forwardRef<HTMLTextAreaElement, LabeledTextAreaFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
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
      <div {...outerProps} data-testid="labeledarea-testid">
        <label {...labelProps}>
          {label}
          <textarea
            {...input}
            disabled={submitting}
            {...props}
            ref={ref}
            data-testid="labeledtarget-testid"
          />
        </label>

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

          textarea {
            font-size: 1rem;
            padding: 0.25rem 0.75rem !important;
            border-radius: 3px;
            appearance: none;
            margin-top: 0.5rem;
          }

          textarea:focus {
            outline-color: oklch(var(--s)) !important;
            outline-offset: 0;
            outline-width: 3px !important;
          }
        `}</style>
      </div>
    )
  }
)

export default LabeledTextAreaField
