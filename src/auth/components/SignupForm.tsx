import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import { Form } from "src/core/components/fields/Form"
import { FORM_ERROR } from "final-form"
import { Signup } from "src/auth/schemas"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import usernameExist, { UserEmailExistErr } from "../mutations/usernameExist"
import { useState } from "react"
import LabeledPasswordField, {
  LabeledPassWordFieldProps,
} from "src/core/components/fields/LabeledPasswordField"

type SignupFormProps = {
  onSuccess?: (values) => void
  signupResponses?: {
    email: string
    password: string
    username: string
  }
}

export const SignupForm = (props: SignupFormProps) => {
  const [usernameEmailExistQuery] = useMutation(usernameExist)

  //TODO move state inside labeled password
  const [currType, setType] = useState("password")
  const handlePasswordToggle = () => {
    if (currType === "password") {
      setType("text")
    } else {
      setType("password")
    }
  }

  const [currTypeV, setcurrTypeV] = useState("password")
  const handleVPasswordToggle = () => {
    if (currTypeV === "password") {
      setcurrTypeV("text")
    } else {
      setcurrTypeV("password")
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
            await usernameEmailExistQuery(values)
            props.onSuccess?.(values)
          } catch (error: any) {
            let e = error as UserEmailExistErr
            if (e?.code === "email_exist") {
              // This error comes from Prisma
              return { email: "You already have an account" }
            } else if (error.code === "user_exist") {
              // This error comes from Prisma
              return { username: "Username already taken" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <LabeledTextField
          name="username"
          label="Username:"
          placeholder="Username"
          className="input mb-4 w-full text-primary input-primary input-bordered border-2 bg-base-300"
        />
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
        <LabeledPasswordField
          name="password_confirm"
          label="Confirm Password:"
          placeholder="Password"
          className="input mb-4 w-full text-primary input-primary input-bordered border-2 bg-base-300"
          onEyeClick={handleVPasswordToggle}
          type={currTypeV as LabeledPassWordFieldProps["type"]}
        />
      </Form>

      <div className="divider pt-2 pb-2"></div>

      <div className="flex flex-row justify-center">
        <Link className="btn btn-warning ml-2" href={Routes.LoginPage()}>
          I have an Account
        </Link>

        <Link className="btn btn-secondary ml-2" href={Routes.Home()}>
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default SignupForm
