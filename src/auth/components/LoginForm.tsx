import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import login from "src/auth/mutations/login"
import { Login } from "src/auth/schemas"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <h1 className="text-center">Login</h1>

      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" className="mb-4 w-full" />
        <LabeledTextField
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
          className="w-full"
        />
      </Form>

      <div className="mt-4">
        <Link className="italic" href={Routes.ForgotPasswordPage()}>
          Forgot your password?
        </Link>
      </div>

      <div className="flex flex-row gap-4 mt-2">
        <p>Don’t have a STAPLE Account yet?</p>
        <Link href={Routes.SignupPage()}>Register now</Link>
      </div>

      <div className="flex flex-row justify-end mt-auto">
        <Link className="btn" href={Routes.Home()}>
          Go back
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
