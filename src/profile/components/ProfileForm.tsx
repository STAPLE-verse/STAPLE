import { Form, FormProps } from "src/core/components/fields/Form"
import { LabeledCheckboxField } from "src/core/components/fields/LabeledCheckboxField"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import LabelSelectField from "src/core/components/fields/LabelSelectField"
import ThemeSelect from "src/core/components/ThemeSelect"
import { getDateLanguageLocales } from "src/core/utils/getDateLanguageLocales"
import { z } from "zod"

export function ProfileForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const languagesOptions = getDateLanguageLocales()

  return (
    <Form<S> {...props}>
      <span className="text-2xl">Required Information:</span>
      <hr className="w-1/2 mb-2"></hr>

      <LabeledTextField
        name="email"
        label="Email:"
        placeholder="Email"
        type="text"
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-1/2"
      />
      <LabeledTextField
        name="username"
        label="Username:"
        placeholder="Username"
        type="text"
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-1/2"
      />

      <span className="text-2xl">User Information:</span>
      <br />
      <span className="text-base italic">
        If you enter your first and last name, it will replace your username in project areas.
      </span>
      <hr className="w-1/2 mb-2"></hr>

      <LabeledTextField
        name="firstName"
        label="First Name:"
        placeholder="First name"
        type="text"
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-1/2"
      />
      <LabeledTextField
        name="lastName"
        label="Last Name:"
        placeholder="Last name"
        type="text"
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-1/2"
      />
      <LabeledTextField
        name="institution"
        label="Institution:"
        placeholder="Institution"
        type="text"
        className="input mb-4 text-primary input-primary input-bordered border-2 bg-base-300 w-1/2"
      />

      <span className="text-2xl">Look and Feel:</span>
      <br />
      <span className="text-base italic"></span>
      <hr className="w-1/2 mb-2"></hr>

      {/* Theme Selector */}
      <ThemeSelect />

      <LabeledCheckboxField
        name="tooltips"
        label={(value) => (value ? "Turn OFF tooltips" : "Turn ON tooltips")}
        className="checkbox checkbox-primary border-2"
        labelProps={{ className: "text-lg" }}
      />

      <LabelSelectField
        className="select text-primary select-bordered border-primary border-2 w-1/2 mb-4 w-1/2"
        name="language"
        label="Select Language:"
        options={languagesOptions}
        optionText="name"
        optionValue="id"
        type="string"
      />
      <LabeledTextField
        name="gravatar"
        label="Gravatar Email:"
        description="This email will only be used to link to your Gravatar account for your profile picture. "
        placeholder="Email"
        type="text"
        className="input mb-8 text-primary input-primary input-bordered border-2 bg-base-300 w-1/2"
      />
    </Form>
  )
}
