import { LabeledCheckboxField } from "src/core/components/LabeledCheckboxField"
import { Form } from "src/core/components/Form"
import { Tos } from "src/auth/schemas"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

type TosFormProps = {
  onSuccess?: (values) => void
  onCancel?: () => void
}

export const TosForm = (props: TosFormProps) => {
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <h1 className="text-center">Terms of Use and Privacy Policy</h1>
      <div className="flex flex-col gap-4">
        <p>
          You are viewing this page either for the first time while signing into STAPLE through your
          institution or due to recent updates to the terms that require your review.
        </p>
        <p>
          To complete the login process, it is imperative that you agree to our Terms of Use and
          Privacy Policy. Please take the time to read them thoroughly.
        </p>
        <p>If you have any questions, feel free to reach out to STAPLE Support for assistance.</p>
      </div>
      <Form
        className="mb-2 mt-6"
        submitText="Continue"
        schema={Tos}
        onSubmit={async (values) => {
          try {
            props.onSuccess?.(values)
          } catch (error: any) {
            console.log(error)
          }
        }}
        cancelText="Go Back"
        onCancel={props.onCancel}
      >
        <LabeledCheckboxField
          name="tos"
          label="I have read and agree to these terms."
        ></LabeledCheckboxField>
      </Form>
      <div className="divider pt-4 pb-4"></div>
      <Link className="text-center" href={Routes.Home()}>
        Cancel and go back to STAPLE Home Page
      </Link>
    </div>
  )
}

export default TosForm
