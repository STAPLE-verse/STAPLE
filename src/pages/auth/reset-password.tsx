import Layout from "src/core/layouts/Layout"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { Form } from "src/core/components/fields/Form"
import { FORM_ERROR } from "final-form"
import { ResetPassword } from "src/auth/schemas"
import resetPassword from "src/auth/mutations/resetPassword"
import { BlitzPage, Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"
import { assert } from "blitz"

const ResetPasswordPage: BlitzPage = () => {
  const router = useRouter()
  const token = router.query.token?.toString()
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full mt-2">
      <div className="flex justify-center items-center w-full">
        <picture>
          <source
            srcSet="/logo_white_big.png"
            media="(prefers-color-scheme: dark)"
            //alt="STAPLE Logo"
            width={200}
          />
          <img src="/logo_black_big.png" alt="STAPLE Logo" width={200} />
        </picture>
      </div>

      <h1 className="text-center text-3xl mt-2">Set a New Password</h1>

      {isSuccess ? (
        <div>
          <h2 className="text-center text-2xl mt-2">Password Reset Successfully</h2>
          <p>
            Go to the <Link href={Routes.Home()}>homepage</Link>
          </p>
        </div>
      ) : (
        <Form
          submitText="Reset Password"
          schema={ResetPassword}
          initialValues={{
            password: "",
            passwordConfirmation: "",
            token,
          }}
          onSubmit={async (values) => {
            try {
              assert(token, "token is required.")
              await resetPasswordMutation({ ...values, token })
            } catch (error: any) {
              if (error.name === "ResetPasswordError") {
                return {
                  [FORM_ERROR]: error.message,
                }
              } else {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                }
              }
            }
          }}
        >
          <LabeledTextField
            name="password"
            label="New Password"
            type="password"
            className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300"
          />
          <LabeledTextField
            name="passwordConfirmation"
            label="Confirm New Password"
            type="password"
            className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300"
          />
        </Form>
      )}
    </div>
  )
}

ResetPasswordPage.redirectAuthenticatedTo = "/"
//ResetPasswordPage.getLayout = (page) => <Layout title="Reset Your Password">{page}</Layout>

export default ResetPasswordPage
