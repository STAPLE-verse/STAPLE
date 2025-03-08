import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { Form } from "src/core/components/fields/Form"
import { FORM_ERROR } from "final-form"
import login from "src/auth/mutations/login"
import { Login } from "src/auth/schemas"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import LabeledPasswordField, {
  LabeledPassWordFieldProps,
} from "src/core/components/fields/LabeledPasswordField"
import { useState } from "react"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  const [currType, setType] = useState("password")
  const handlePasswordToggle = () => {
    if (currType === "password") {
      setType("text")
    } else {
      setType("password")
    }
  }

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full justify-center flex-grow">
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
      <h1 className="text-center text-3xl">Log In</h1>
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
          className="input mb-4 w-full text-primary input-primary input-bordered border-2 bg-base-300"
        />

        <LabeledPasswordField
          name="password"
          label="Password:"
          placeholder="Password"
          type={currType as LabeledPassWordFieldProps["type"]}
          onEyeClick={handlePasswordToggle}
          className="input mb-4 w-full text-primary input-primary input-bordered border-2 bg-base-300"
        />
      </Form>

      <div className="divider pt-4 pb-4"></div>
      <div className="flex flex-row justify-center">
        <Link className="btn btn-warning ml-2" href={Routes.ForgotPasswordPage()}>
          Forgot Password
        </Link>

        <Link className="btn btn-info ml-2" href={Routes.SignupPage()}>
          Register
        </Link>

        <Link className="btn btn-secondary ml-2" href={Routes.Home()}>
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
