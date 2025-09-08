import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef, useState } from "react"
import { useField, UseFieldConfig } from "react-final-form"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"

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
    const [mode, setMode] = useState<"edit" | "preview">("edit")

    return (
      <div {...outerProps} data-testid="labeledarea-testid">
        <label {...labelProps}>
          {label}

          {/* Toolbar */}
          <div className="flex items-center mt-2">
            <div className="join">
              <button
                type="button"
                className={`btn btn-sm join-item ${mode === "edit" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setMode("edit")}
              >
                Edit
              </button>
              <button
                type="button"
                className={`btn btn-sm join-item ${
                  mode === "preview" ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setMode("preview")}
              >
                Preview
              </button>
            </div>
            <span className="text-sm text-base-content ml-3 italic">
              Supports{" "}
              <a
                href="https://www.markdownguide.org/cheat-sheet/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Markdown
              </a>{" "}
              formatting.
            </span>
          </div>

          {mode === "edit" ? (
            <textarea
              {...input}
              disabled={submitting}
              {...props}
              ref={ref}
              data-testid="labeledtarget-testid"
              rows={6}
              wrap="soft"
            />
          ) : (
            <div className="markdown-preview mb-4" data-testid="labeledpreview-testid">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                    />
                  ),
                }}
              >
                {input.value || "_Nothing to preview yet…_"}
              </ReactMarkdown>
            </div>
          )}
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
            resize: both;
            overflow: auto;
            max-width: 100%;
            white-space: pre-wrap;
            line-height: 1.5;
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
