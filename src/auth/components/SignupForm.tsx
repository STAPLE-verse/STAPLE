import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { Form } from "src/core/components/fields/Form"
import { FORM_ERROR } from "final-form"
import { Signup } from "src/auth/schemas"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { FormSpy } from "react-final-form"
import { useMutation } from "@blitzjs/rpc"
import db from "db"

type SignupFormProps = {
  onSuccess?: (values) => void
  signupResponses?: {
    email: string
    password: string
    username: string
  }
}

export const SignupForm = (props: SignupFormProps) => {
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

      <h1 className="text-center text-3xl mt-2">Sign Up</h1>
      <Form
        className=""
        submitText="Create Account"
        schema={Signup}
        initialValues={{
          email: props.signupResponses?.email,
          password: props.signupResponses?.password,
          username: props.signupResponses?.username,
          password_confirm: props.signupResponses?.password,
        }}
        onSubmit={async (values) => {
          try {
            console.log(values.username)
            const userExist = await db.user.findUnique({
              where: {
                username: values.username,
              },
              return: {
                user: true,
              },
            })
            if (userExist) {
              console.log("username exists")
            }

            props.onSuccess?.(values)
          } catch (error: any) {}
        }}
      >
        <LabeledTextField
          name="username"
          label="Username:"
          placeholder="Username"
          className="w-full text-primary border-primary border-2 mb-4 bg-base-300"
        />
        <LabeledTextField
          name="email"
          label="Email:"
          placeholder="Email"
          className="mb-4 w-full text-primary border-primary border-2 bg-base-300"
        />

        <LabeledTextField
          name="password"
          label="Password:"
          placeholder="Password"
          type="password"
          className="mb-4 w-full text-primary border-primary border-2 bg-base-300"
        />

        <LabeledTextField
          name="password_confirm"
          label="Confirm Password:"
          placeholder="Password"
          type="password"
          className="mb-4 w-full text-primary border-primary border-2 bg-base-300"
        />
      </Form>

      <div className="flex flex-row justify-end mb-4 mt-4">
        <Link className="btn btn-info" href={Routes.LoginPage()}>
          I have an Account
        </Link>
      </div>

      <div className="flex flex-row justify-end mb-4">
        <Link className="btn btn-secondary" href={Routes.Home()}>
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default SignupForm
