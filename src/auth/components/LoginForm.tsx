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
    <div className="flex flex-col justify-center items-center text-center flex-grow">
      <h1>Login</h1>

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
        <LabeledTextField name="email" label="Email" placeholder="Email" className="mb-4" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        <div className="pt-4">
          <Link className="italic" href={Routes.ForgotPasswordPage()}>
            Forgot your password?
          </Link>
        </div>
      </Form>

      <div className="mt-2">
        {/* <div className="divider">OR</div> */}
        <Link className="btn" href={Routes.SignupPage()}>
          Sign Up
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
