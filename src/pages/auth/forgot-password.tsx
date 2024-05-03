import Layout from "src/core/layouts/Layout"
import Link from "next/link"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import { ForgotPassword } from "src/auth/schemas"
import forgotPassword from "src/auth/mutations/forgotPassword"
import { useMutation } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import { Routes } from "@blitzjs/next"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full mt-2">
      <center>
        <picture>
          <source
            srcset="/logo_white_big.png"
            media="(prefers-color-scheme: dark)"
            alt="STAPLE Logo"
            width={200}
          />
          <img src="/logo_black_big.png" alt="STAPLE Logo" width={200} />
        </picture>
      </center>

      <h1 className="text-center text-3xl">Reset Password</h1>

      {isSuccess ? (
        <div className="mt-2 mb-2">
          <h2 className="text-center text-3xl">Request Submitted</h2>
          <p>
            If your email is in our system, you will receive instructions to reset your password
            shortly.
          </p>
        </div>
      ) : (
        <Form
          submitText="Send Reset Password Instructions"
          schema={ForgotPassword}
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            try {
              await forgotPasswordMutation(values)
            } catch (error: any) {
              return {
                [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
              }
            }
          }}
        >
          <LabeledTextField
            name="email"
            label="Email:"
            placeholder="Email"
            className="mb-4 mt-4 w-full text-primary border-primary border-2 bg-base-300"
          />
        </Form>
      )}
      <div className="flex flex-row justify-end mt-4">
        <Link className="btn btn-secondary" href={Routes.Home()}>
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
