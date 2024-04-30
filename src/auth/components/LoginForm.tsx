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

      <h1 className="text-center text-4xl">Log In</h1>

      <Form
        submitText="Log In"
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
        <LabeledTextField
          name="email"
          label="Email:"
          placeholder="Email"
          className="mb-4 w-full text-primary border-primary border-2"
        />

        <LabeledTextField
          name="password"
          label="Password:"
          placeholder="Password"
          type="password"
          className="w-full text-primary border-primary border-2"
        />
      </Form>

      <div className="flex flex-row justify-end mt-4">
        <Link className="btn btn-warning" href={Routes.ForgotPasswordPage()}>
          Forgot Password
        </Link>
      </div>

      <div className="flex flex-row justify-end mt-4">
        <Link className="btn btn-info" href={Routes.SignupPage()}>
          Register
        </Link>
      </div>

      <div className="flex flex-row justify-end mt-4">
        <Link className="btn btn-secondary" href={Routes.Home()}>
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
