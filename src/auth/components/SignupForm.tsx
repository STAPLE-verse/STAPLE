import { LabeledTextField } from "src/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/core/components/Form"
import signup from "src/auth/mutations/signup"
import { Signup } from "src/auth/schemas"
import { useMutation } from "@blitzjs/rpc"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)
  return (
    <div className="flex flex-col justify-center items-center text-center flex-grow">
      <h1>Create an Account</h1>

      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{ email: "", password: "", username: "" }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else if (error.code === "P2002" && error.meta?.target?.includes("username")) {
              // This error comes from Prisma
              return { email: "This username is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" className="mb-4" />
        <LabeledTextField
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
          className="mb-4"
        />
        <LabeledTextField name="username" label="Username" placeholder="Username" />
      </Form>
    </div>
  )
}

export default SignupForm
