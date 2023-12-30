import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import { Signup } from "src/auth/schemas"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

type SignupFormProps = {
  onSuccess?: (values) => void
  signupResponses?: {
    email: string
    password: string
    username: string
  }
}

export const SignupForm = (props: SignupFormProps) => {
  // const [signupMutation] = useMutation(signup)
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <h1 className="text-center">Create Account</h1>
      <Form
        className="mb-2"
        submitText="Create Account"
        schema={Signup}
        initialValues={{
          email: props.signupResponses?.email,
          password: props.signupResponses?.password,
          username: props.signupResponses?.username,
        }}
        onSubmit={async (values) => {
          try {
            // await signupMutation(values)
            props.onSuccess?.(values)
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else if (error.code === "P2002" && error.meta?.target?.includes("username")) {
              // This error comes from Prisma
              return { username: "This username is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="" className="mb-4 w-full" />
        <LabeledTextField
          name="password"
          label="Password"
          placeholder=""
          type="password"
          className="mb-4 w-full"
        />
        <LabeledTextField name="username" label="Username" placeholder="" className="w-full" />
      </Form>
      <div className="flex flex-row gap-2">
        <p>Already have an account?</p> <Link href={Routes.LoginPage()}>Log in</Link>
      </div>
      <div className="flex flex-row justify-end mt-auto">
        <Link className="btn" href={Routes.Home()}>
          Go back
        </Link>
      </div>
    </div>
  )
}

export default SignupForm
