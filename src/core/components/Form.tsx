import { ReactNode, PropsWithoutRef } from "react"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
import { z } from "zod"
import { validateZodSchema } from "blitz"
export { FORM_ERROR } from "final-form"
import Link from "next/link"
import { Url } from "next/dist/shared/lib/router/router"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: S
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"]
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"]
  /** Route to go if canceled */
  /** TODO: I have no clue how to check for this properly */
  cancelRoute?: Url
}

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  cancelRoute,
  ...props
}: FormProps<S>) {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, submitError }) => (
        <form onSubmit={handleSubmit} className="form" {...props}>
          {/* Form fields supplied as children are rendered here */}
          {children}

          {submitError && (
            <div role="alert" style={{ color: "red" }}>
              {submitError}
            </div>
          )}

          {submitText && (
            // TODO: Look for a better way to do this
            <div className={cancelRoute ? "" : "join join-vertical lg:join-horizontal"}>
              <button className="btn mt-4" type="submit" disabled={submitting}>
                {submitText}
              </button>
              {cancelRoute && (
                // TODO: Although href is expecting a type of URL it never gets rendered without it
                <Link className="btn ml-4" href={cancelRoute}>
                  Cancel
                </Link>
              )}
            </div>
          )}

          {/* <style global jsx>{`
            .form > * + * {
              margin-top: 1rem;
            }
          `}</style> */}
        </form>
      )}
    />
  )
}

export default Form
